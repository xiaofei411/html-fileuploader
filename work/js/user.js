$(document).ready(function() {

	var saveEditedImage = function(image, item) {
		
		// set new image
		item.editor._blob = image;
		
		// if still uploading
		// pend and exit
		if (item.upload && item.upload.status == 'loading')
			return item.editor.isUploadPending = true;
		
		// if not uploaded
		if (item.upload && item.upload.send && !item.upload.status) {
			item.editor._namee = item.name;
			return item.upload.send();
		}

		// if not preloaded or not uploaded
		if (!item.appended && !item.uploaded)
			return;

		// if no editor
		if (!item.editor || !item.reader.width)
			return;
		
		// if uploaded
		// resend upload
		
		if (item.upload && item.upload.resend) {
			item.editor._namee = item.name;
			item.editor._editingg = true;
			item.upload.resend();
		}

		// if preloaded
		// send request
		if (item.appended) {
			// hide current thumbnail (this is only animation)
			item.imageIsUploading = true;
			item.editor._editingg = true;

			var form = new FormData();

			form.append('avatar[]', item.editor._blob, item.name);
			form.append('fileuploader', 1);
			form.append('_namee', item.name);
			form.append('id', 3);
			form.append('type', "User");
			

			let rotation = item.editor.rotation
			$.ajax({
				url: 'https://salty-citadel-36912.herokuapp.com/attachments/avatar',
				data: form,
		  		type: 'POST',
				processData: false,
		  		contentType: false,
	  		 	success:function(result) {
			      	
			      	var api = $.fileuploader.getInstance("input[type='file']"),
						$progressBar = item.html.find('.progressbar3'),
						data = {};
					
					
					if (api.getFiles().length > 1)
						api.getFiles()[0].remove();
	                
					
					// if success
	                if (result.status == 200) {
	                    
	                    item.saved = true;
						item.editor.rotation = rotation;
						

						//item.file = result.blob[0].file
	     //                convertImgToBase64URL(result.data, function(base64Img){
	     //                	console.log('item', item)
	     //                	let blobs = result.blob;
	     //                	blobs[0].file = base64Img
						//     item.file = base64Img
						//     item.reader.src = base64Img
						//     //$('.reader-node img').attr('src', base64Img);
						//     var data = $('input[name="fileuploader-list-avatar"]').val();
						//     console.log(JSON.parse(data));
						//     data[0].file = base64Img;
						    
						//     $('input[name="fileuploader-list-avatar"]').val(JSON.stringify(data));
						// });
						
					}

					
					// if warnings
					if (result.status != 200) {
						alert("upload failed");
						
						item.html.removeClass('upload-successful').addClass('upload-failed');
						return this.onError ? this.onError(item) : null;
					}
					
					delete item.isSaving;
					item.html.addClass('upload-complete').removeClass('is-image-waiting');
					// replace the image from the source
					item.html.find('img').attr('src', result.data); 

					$progressBar.find('span').html('<i class="fileuploader-icon-success"></i>');
					
					setTimeout(function() {
						$progressBar.fadeOut(450);
					}, 1250);
					item.image.fadeIn(250);
			    }
			});
		}
	};


	function convertImgToBase64URL(url, callback, outputFormat){
	    var img = new Image();
	    img.crossOrigin = 'Anonymous';
	    img.onload = function(){
	        var canvas = document.createElement('CANVAS'),
	        ctx = canvas.getContext('2d'), dataURL;
	        canvas.height = img.height;
	        canvas.width = img.width;
	        ctx.drawImage(img, 0, 0);
	        dataURL = canvas.toDataURL(outputFormat);
	        callback(dataURL);
	        canvas = null; 
	    };
	    img.src = url;
	}

	$.get( "https://salty-citadel-36912.herokuapp.com/attachments/get_avatar?type=User&id=3", function( res ) {

		result = res.blob
		
		if(result) {
			convertImgToBase64URL(result[0].file, function(base64Img){
			    result[0].file = base64Img
			    InitUploader( result )
			});
			
		}
		else
			InitUploader( null )

	});


	
	function InitUploader( files ) {
		// enable fileupload plugin
		$('input[name="avatar"]').fileuploader({
			files: files,
			limit: 2,
	        extensions: ['image/*'],
			fileMaxSize: 10,
			changeInput: ' ',
			theme: 'avatar',
			addMore: true,
	        enableApi: true,
			thumbnails: {
				box: '<div class="fileuploader-wrapper">' +
						'<div class="fileuploader-items"></div>' +
						'<div class="fileuploader-droparea" data-action="fileuploader-input"><i class="fileuploader-icon-main"></i></div>' +
					   '</div>' +
						'<div class="fileuploader-menu">' +
							'<button type="button" class="fileuploader-menu-open"><i class="fileuploader-icon-menu"></i></button>' +
							'<ul>' +
								'<li><a class="default" data-action="fileuploader-input"><i class="fileuploader-icon-upload"></i> ${captions.upload}</a></li>' +
								'<li><a data-action="fileuploader-edit"><i class="fileuploader-icon-edit"></i> ${captions.edit}</a></li>' +
								'<li><a class="default" data-action="fileuploader-remove"><i class="fileuploader-icon-trash"></i> ${captions.remove}</a></li>' +
							'</ul>' +
						'</div>',
				item: '<div class="fileuploader-item">' +
					      '${image}' +
						  '<span class="fileuploader-action-popup" data-action="fileuploader-edit"></span>' +
						  '<div class="progressbar3" style="display: none"></div>' +
						'</div>',
				item2: null,
				itemPrepend: true,
				startImageRenderer: true,
	            canvasImage: false,
				_selectors: {
					list: '.fileuploader-items'
				},
				popup: {
					arrows: false,
					onShow: function(item) {
						item.popup.html.addClass('is-for-avatar');
						item.popup.html.find('img').attr('crossorigin', 'anonymous');
	                    item.popup.html.on('click', '[data-action="remove"]', function(e) {
	                        item.popup.close();
	                        item.remove();
	                    }).on('click', '[data-action="cancel"]', function(e) {
	                        item.popup.close();
	                    }).on('click', '[data-action="save"]', function(e) {
							if (item.editor && !item.isSaving) {
								item.isSaving = true;
	                        	
	                        	
	                        	item.editor.save(function(blob, item) {
									saveEditedImage(blob, item);
								}, true, null, false);
							}
							if (item.popup.close)
								item.popup.close();
	                    });
	                },
					onHide: function(item) {
						if (!item.isSaving && !item.uploaded && !item.appended) {
							item.popup.close = null;
							item.remove();
						}
					} 	
				},
				onItemShow: function(item) {
					
					if (item.choosed)
					{
						item.html.addClass('is-image-waiting');
					}
				},
				onImageLoaded: function(item, listEl, parentEl, newInputEl, inputEl) {
					if(item.saved) {
						
					}
	                else if (item.choosed && !item.isSaving) {
						if (item.reader.node && item.reader.width >= 256 && item.reader.height >= 256) {
							item.image.hide();
							item.popup.open();
							// item.editor.cropper();
						} else {
							item.remove();
							alert('The image is too small!');
						}
					} else if (item.data.isDefault)
						item.html.addClass('is-default');
					else if (item.image.hasClass('fileuploader-no-thumbnail'))
						item.html.hide();
	            },
				onItemRemove: function(html) {
					html.fadeOut(250, function() {
						html.remove();
					});
				}
			},
			dragDrop: {
				container: '.fileuploader-wrapper'
			},
			editor: {
	            cropper: {
					ratio: '1:1',
					minWidth: 256,
					minHeight: 256,
					showGrid: false
				},
				onSave: function(base64, item, listEl, parentEl, newInputEl, inputEl) {
					var api = $.fileuploader.getInstance(inputEl);
					
					if (item.upload) {
	//					if (api.getFiles().length == 2 && (api.getFiles()[0].data.isDefault || api.getFiles()[0].upload))
	//						api.getFiles()[0].remove();
						parentEl.find('.fileuploader-menu ul a').show();
						
						if (item.upload.send)
							return item.upload.send();
						if (item.upload.resend)
							return item.upload.resend();
					} else if (item.appended) {
						// hide current thumbnail (this is only animation)
						item.image.addClass('fileuploader-loading').html('');
						item.html.find('.fileuploader-action-popup').hide();
						parentEl.find('[data-action="fileuploader-edit"]').hide();

						
						
						item.reader.read(function() {
							item.html.find('.fileuploader-action-popup').show();
							parentEl.find('[data-action="fileuploader-edit"]').show();
							
							item.popup.html = item.popup.editor = item.editor.crop = item.editor.rotation = item.popup.zoomer = null;
							item.renderThumbnail();
						}, null, true);
						
					}
				}
	        },
			upload: {
	            url: 'https://salty-citadel-36912.herokuapp.com/attachments/avatar',
	            data: {
	            	type: "User",
	            	id: 3
	            },
	            type: 'POST',
	            enctype: 'multipart/form-data',
	            start: false,
	            synchron: true,
	            beforeSend: function(item, listEl, parentEl, newInputEl, inputEl) {

	            	// add image to formData
					if (item.editor && item.editor._blob) {
						item.upload.data.fileuploader = 1;
	                    if (item.upload.formData.delete)
						   item.upload.formData.delete(inputEl.attr('name'));
						item.upload.formData.append(inputEl.attr('name'), item.editor._blob, item.name);
						
						// add name to data
						if (item.editor._namee) {
							item.upload.data._namee = item.name;
						}

						// add is after editing to data
						if (item.editor._editingg) {
							item.upload.data._editingg = true;
						}
					}

					// if (item.editor && (typeof item.editor.rotation != "undefined" || item.editor.crop)) {

					// 	console.log('upload beforeSend if condition', item.editor, item.upload);

					// 	item.upload.data.fileuploader = 1;
					// 	item.upload.data.name = item.name;
					// 	item.upload.data._editorr = JSON.stringify(item.editor);
					// }
					
					item.image.hide();
					item.html.removeClass('upload-complete');
					parentEl.find('[data-action="fileuploader-edit"]').hide();
					this.onProgress({percentage: 0}, item);
				},
	            onSuccess: function(result, item, listEl, parentEl, newInputEl, inputEl) {
	                var api = $.fileuploader.getInstance(inputEl),
						$progressBar = item.html.find('.progressbar3'),
						data = {};
					
						
					
					if (api.getFiles().length > 1)
						api.getFiles()[0].remove();
	                


					// if success
	                if (result.status == 200) {
	                    item.name = result.data;
	                    item.saved = true;
					}


					
					// if warnings
					if (result.status != 200) {
						alert("upload failed");
						
						item.html.removeClass('upload-successful').addClass('upload-failed');
						return this.onError ? this.onError(item) : null;
					}
					
					delete item.isSaving;
					item.html.addClass('upload-complete').removeClass('is-image-waiting');
					// replace the image from the source
					item.html.find('img').attr('src', result.data); 

					$progressBar.find('span').html('<i class="fileuploader-icon-success"></i>');
					parentEl.find('[data-action="fileuploader-edit"]').show();
					setTimeout(function() {
						$progressBar.fadeOut(450);
					}, 1250);
					item.image.fadeIn(250);
	            },
	            onError: function(item, listEl, parentEl, newInputEl, inputEl) {
					var $progressBar = item.html.find('.progressbar3');
					
					item.html.addClass('upload-complete');
					if (item.upload.status != 'cancelled')
						$progressBar.find('span').attr('data-action', 'fileuploader-retry').html('<i class="fileuploader-icon-retry"></i>');
	            },
	            onProgress: function(data, item) {
	                var $progressBar = item.html.find('.progressbar3');
					
					if (data.percentage == 0)
						$progressBar.addClass('is-reset').fadeIn(250).html('');
					else if (data.percentage >= 99)
						data.percentage = 100;
					else
						$progressBar.removeClass('is-reset');
					if (!$progressBar.children().length)
						$progressBar.html('<span></span><svg><circle class="progress-dash"></circle><circle class="progress-circle"></circle></svg>');
					
					var $span = $progressBar.find('span'),
						$svg = $progressBar.find('svg'),
						$bar = $svg.find('.progress-circle'),
						hh = Math.max(60, item.html.height() / 2),
						radius = Math.round(hh / 2.28),
						circumference = radius * 2 * Math.PI,
						offset = circumference - data.percentage / 100 * circumference;
					
					$svg.find('circle').attr({
						r: radius,
						cx: hh,
						cy: hh
					});
					$bar.css({
						strokeDasharray: circumference + ' ' + circumference,
						strokeDashoffset: offset
					});
					
					$span.html(data.percentage + '%');
	            },
	            onComplete: null,
	        },
			afterRender: function(listEl, parentEl, newInputEl, inputEl) {
				var api = $.fileuploader.getInstance(inputEl);
				
				// remove multiple attribute
				inputEl.removeAttr('multiple');
				
				// disabled input
				if (api.isDisabled()) {
					parentEl.find('.fileuploader-menu').remove();
				}
				
				// [data-action]
				parentEl.on('click', '[data-action]', function() {
					var $this = $(this),
						action = $this.attr('data-action'),
						item = api.getFiles().length ? api.getFiles()[api.getFiles().length-1] : null;
					
					switch (action) {
						case 'fileuploader-input':
							api.open();
							break;
						case 'fileuploader-edit':
							if (item && item.popup) {
								item.popup.open();
								//item.editor.cropper();
							}
							break;
						case 'fileuploader-retry':
							if (item && item.upload.retry)
								item.upload.retry();
							break;
						case 'fileuploader-remove':
							if (item)
								item.clickRemove = true;
								item.remove();
							break;
					}
				});
				
				// menu
				$('body').on('click', function(e) {
					var $target = $(e.target),
						$parent = $target.closest('.fileuploader');
					
					$('.fileuploader-menu').removeClass('is-shown');
					if ($target.is('.fileuploader-menu-open') || $target.closest('.fileuploader-menu-open').length)
						$parent.find('.fileuploader-menu').addClass('is-shown');
				});
			},
			onEmpty: function(listEl, parentEl, newInputEl, inputEl) {
				var api = $.fileuploader.getInstance(inputEl);
				
				parentEl.find('.fileuploader-items').append($('.initial-profile'))
				$('.initial-profile').initial({
					name : "SJ",
					charCount : 2
				});
				
				parentEl.find('.fileuploader-menu ul a').hide().filter('[data-action="fileuploader-input"]').show();
				


				
			},
			onRemove: function(item) {
				if(item.clickRemove != true)
					return;
				
				$.ajax({
				    url: 'https://salty-citadel-36912.herokuapp.com/attachments/destroy_avatar',
				    type: 'DELETE',
				    data: {
				    	"_method": 'delete',
				    	"type": "User",
						"id": 3
			    	},
				    success: function(result) {
				        
				    },
				    error: function (data) {
	                    console.log('remove Error:', data);
	                }
				});
				
			},
			captions: {
				edit: 'Edit',
				upload: 'Upload',
				remove: 'Remove',
				errors: {
	        		filesLimit: 'Only 1 file is allowed to be uploaded.',
				}
			}
	    });
	}

});

