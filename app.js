
document.addEventListener('DOMContentLoaded', function() {
            const uploadArea = document.getElementById('uploadArea');
            const fileInput = document.getElementById('fileInput');
            const imagePreview = document.getElementById('imagePreview');
            const extractBtn = document.getElementById('extractBtn');
            const resultDiv = document.getElementById('result');
            const progressContainer = document.getElementById('progressContainer');
            const progressBar = document.getElementById('progressBar');
            const statusText = document.getElementById('statusText');
            
            // Handle click on upload area
            uploadArea.addEventListener('click', function() {
                fileInput.click();
            });
            
            // Handle drag and drop
            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                uploadArea.style.backgroundColor = '#f0f8ff';
                uploadArea.style.borderColor = '#2980b9';
            });
            
            uploadArea.addEventListener('dragleave', function() {
                uploadArea.style.backgroundColor = '';
                uploadArea.style.borderColor = '#3498db';
            });
            
            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                uploadArea.style.backgroundColor = '';
                uploadArea.style.borderColor = '#3498db';
                
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    handleFileSelect(e.dataTransfer.files[0]);
                }
            });
            
            // Handle file selection
            fileInput.addEventListener('change', function() {
                if (fileInput.files.length) {
                    handleFileSelect(fileInput.files[0]);
                }
            });
            
            function handleFileSelect(file) {
                // Check if file is an image
                if (!file.type.match('image.*')) {
                    alert('Please select an image file.');
                    return;
                }
                
                // Display the image preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    extractBtn.disabled = false;
                };
                reader.readAsDataURL(file);
            }
            
            // Handle text extraction
            extractBtn.addEventListener('click', function() {
                if (!fileInput.files.length) {
                    alert('Please select an image first.');
                    return;
                }
                
                // Show progress bar
                progressContainer.style.display = 'block';
                progressBar.value = 0;
                statusText.textContent = 'Initializing OCR engine...';
                
                // Perform OCR
                Tesseract.recognize(
                    fileInput.files[0],
                    'eng', // Language (English)
                    {
                        logger: m => {
                            if (m.status === 'recognizing text') {
                                progressBar.value = m.progress * 100;
                                statusText.textContent = `Processing: ${Math.round(m.progress * 100)}%`;
                            } else {
                                statusText.textContent = m.status;
                            }
                        }
                    }
                ).then(({ data: { text } }) => {
                    resultDiv.textContent = text;
                    statusText.textContent = 'OCR completed successfully!';
                    progressBar.value = 100;
                }).catch(err => {
                    console.error(err);
                    statusText.textContent = 'Error occurred during OCR processing.';
                    resultDiv.textContent = 'Error: ' + err.message;
                });
            });
        });
