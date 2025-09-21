"""
OCR Service for Image/PDF Text Extraction
Extracts text from images and PDFs using Google Vision API and PyMuPDF
"""

import os
import base64
import io
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
import tempfile
import fitz  # PyMuPDF
from PIL import Image
import requests

load_dotenv()

class OCRService:
    def __init__(self):
        # Configure Google Vision API (optional - can use PyMuPDF for PDFs)
        self.vision_api_key = os.getenv('GOOGLE_VISION_API_KEY')
        self.vision_api_url = "https://vision.googleapis.com/v1/images:annotate"
        
        # Supported file types
        self.supported_image_types = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp']
        self.supported_pdf_types = ['.pdf']
        self.supported_text_types = ['.txt']
        self.supported_doc_types = ['.doc', '.docx']
        self.max_file_size = 10 * 1024 * 1024  # 10MB
    
    def extract_text_from_file(self, file_path: str) -> Dict[str, Any]:
        """
        Extract text from image or PDF file
        
        Args:
            file_path: Path to the file
            
        Returns:
            Dictionary containing extracted text and metadata
        """
        try:
            # Check if file exists
            if not os.path.exists(file_path):
                return {
                    "success": False,
                    "error": "File not found",
                    "extracted_text": None
                }
            
            # Check file size
            file_size = os.path.getsize(file_path)
            if file_size > self.max_file_size:
                return {
                    "success": False,
                    "error": f"File too large. Maximum size is {self.max_file_size / (1024*1024):.1f}MB",
                    "extracted_text": None
                }
            
            # Get file extension
            file_extension = os.path.splitext(file_path)[1].lower()
            
            if file_extension in self.supported_pdf_types:
                return self._extract_from_pdf(file_path)
            elif file_extension in self.supported_image_types:
                return self._extract_from_image(file_path)
            elif file_extension in self.supported_text_types:
                return self._extract_from_text(file_path)
            elif file_extension in self.supported_doc_types:
                return self._extract_from_doc(file_path)
            else:
                return {
                    "success": False,
                    "error": f"Unsupported file type: {file_extension}",
                    "extracted_text": None
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "extracted_text": None
            }
    
    def extract_text_from_base64(self, base64_data: str, file_type: str) -> Dict[str, Any]:
        """
        Extract text from base64 encoded image data
        
        Args:
            base64_data: Base64 encoded image data
            file_type: Type of file (image/pdf)
            
        Returns:
            Dictionary containing extracted text
        """
        try:
            # Decode base64 data
            file_data = base64.b64decode(base64_data)
            
            # Check size
            if len(file_data) > self.max_file_size:
                return {
                    "success": False,
                    "error": f"File too large. Maximum size is {self.max_file_size / (1024*1024):.1f}MB",
                    "extracted_text": None
                }
            
            # Create temporary file
            file_extension = f".{file_type}" if not file_type.startswith('.') else file_type
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
                temp_file.write(file_data)
                temp_file_path = temp_file.name
            
            try:
                # Extract text using the temporary file
                result = self.extract_text_from_file(temp_file_path)
                return result
            finally:
                # Clean up temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                    
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "extracted_text": None
            }
    
    def _extract_from_pdf(self, file_path: str) -> Dict[str, Any]:
        """
        Extract text from PDF using PyMuPDF
        """
        try:
            doc = fitz.open(file_path)
            extracted_text = ""
            page_count = len(doc)
            
            for page_num in range(page_count):
                page = doc.load_page(page_num)
                text = page.get_text()
                extracted_text += f"\n--- Page {page_num + 1} ---\n{text}\n"
            
            doc.close()
            
            return {
                "success": True,
                "extracted_text": extracted_text.strip(),
                "metadata": {
                    "file_type": "pdf",
                    "page_count": page_count,
                    "character_count": len(extracted_text),
                    "word_count": len(extracted_text.split())
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"PDF extraction failed: {str(e)}",
                "extracted_text": None
            }
    
    def _extract_from_image(self, file_path: str) -> Dict[str, Any]:
        """
        Extract text from image using Google Vision API or PyMuPDF
        """
        try:
            # Try Google Vision API first if available
            if self.vision_api_key:
                result = self._extract_with_vision_api(file_path)
                if result['success']:
                    return result
            
            # Fallback to PyMuPDF for image OCR (if it's a PDF with images)
            try:
                doc = fitz.open(file_path)
                extracted_text = ""
                
                for page_num in range(len(doc)):
                    page = doc.load_page(page_num)
                    text = page.get_text()
                    if text.strip():  # Only add if there's actual text
                        extracted_text += text + "\n"
                
                doc.close()
                
                if extracted_text.strip():
                    return {
                        "success": True,
                        "extracted_text": extracted_text.strip(),
                        "metadata": {
                            "file_type": "image",
                            "extraction_method": "pymupdf",
                            "character_count": len(extracted_text),
                            "word_count": len(extracted_text.split())
                        }
                    }
            except:
                pass
            
            # If no text found, return error
            return {
                "success": False,
                "error": "No text found in image. Please ensure the image contains clear, readable text.",
                "extracted_text": None
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Image extraction failed: {str(e)}",
                "extracted_text": None
            }
    
    def _extract_with_vision_api(self, file_path: str) -> Dict[str, Any]:
        """
        Extract text using Google Vision API
        """
        try:
            # Read and encode image
            with open(file_path, 'rb') as image_file:
                image_content = base64.b64encode(image_file.read()).decode()
            
            # Prepare request
            request_body = {
                "requests": [
                    {
                        "image": {
                            "content": image_content
                        },
                        "features": [
                            {
                                "type": "TEXT_DETECTION",
                                "maxResults": 1
                            }
                        ]
                    }
                ]
            }
            
            # Make API request
            url = f"{self.vision_api_url}?key={self.vision_api_key}"
            response = requests.post(url, json=request_body)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'responses' in data and len(data['responses']) > 0:
                    response_data = data['responses'][0]
                    
                    if 'textAnnotations' in response_data and len(response_data['textAnnotations']) > 0:
                        extracted_text = response_data['textAnnotations'][0]['description']
                        
                        return {
                            "success": True,
                            "extracted_text": extracted_text,
                            "metadata": {
                                "file_type": "image",
                                "extraction_method": "google_vision",
                                "character_count": len(extracted_text),
                                "word_count": len(extracted_text.split())
                            }
                        }
            
            return {
                "success": False,
                "error": "Google Vision API could not extract text from image",
                "extracted_text": None
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Google Vision API error: {str(e)}",
                "extracted_text": None
            }
    
    def _extract_from_text(self, file_path: str) -> Dict[str, Any]:
        """
        Extract text from plain text file
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text_content = file.read().strip()
            
            if not text_content:
                return {
                    "success": False,
                    "error": "Text file is empty",
                    "extracted_text": None
                }
            
            return {
                "success": True,
                "extracted_text": text_content,
                "method": "direct_text_read",
                "file_type": "text",
                "char_count": len(text_content)
            }
            
        except UnicodeDecodeError:
            # Try with different encoding
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    text_content = file.read().strip()
                
                return {
                    "success": True,
                    "extracted_text": text_content,
                    "method": "direct_text_read_latin1",
                    "file_type": "text",
                    "char_count": len(text_content)
                }
            except Exception as e:
                return {
                    "success": False,
                    "error": f"Failed to read text file: {str(e)}",
                    "extracted_text": None
                }
        except Exception as e:
            return {
                "success": False,
                "error": f"Text extraction failed: {str(e)}",
                "extracted_text": None
            }
    
    def _extract_from_doc(self, file_path: str) -> Dict[str, Any]:
        """
        Extract text from DOC/DOCX files
        """
        try:
            # For DOC/DOCX files, we'll use a simple approach
            # In production, you'd want to use python-docx library
            import subprocess
            import tempfile
            
            # Try to use LibreOffice or similar to convert to text
            try:
                # Create a temporary text file
                with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as temp_file:
                    temp_path = temp_file.name
                
                # Try to convert using LibreOffice (if available)
                result = subprocess.run([
                    'libreoffice', '--headless', '--convert-to', 'txt:Text',
                    '--outdir', tempfile.gettempdir(), file_path
                ], capture_output=True, text=True, timeout=30)
                
                if result.returncode == 0:
                    # Read the converted text file
                    converted_file = os.path.splitext(file_path)[0] + '.txt'
                    if os.path.exists(converted_file):
                        with open(converted_file, 'r', encoding='utf-8') as f:
                            text_content = f.read().strip()
                        os.remove(converted_file)  # Clean up
                        
                        if text_content:
                            return {
                                "success": True,
                                "extracted_text": text_content,
                                "method": "libreoffice_conversion",
                                "file_type": "doc",
                                "char_count": len(text_content)
                            }
                
            except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
                pass
            
            # Fallback: try to read as binary and extract basic text
            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
                
                # Simple text extraction from binary (very basic)
                text_parts = []
                current_text = ""
                for byte in content:
                    if 32 <= byte <= 126:  # Printable ASCII
                        current_text += chr(byte)
                    else:
                        if len(current_text) > 3:
                            text_parts.append(current_text)
                        current_text = ""
                
                if len(current_text) > 3:
                    text_parts.append(current_text)
                
                extracted_text = " ".join(text_parts).strip()
                
                if extracted_text and len(extracted_text) > 10:
                    return {
                        "success": True,
                        "extracted_text": extracted_text,
                        "method": "binary_extraction",
                        "file_type": "doc",
                        "char_count": len(extracted_text)
                    }
                
            except Exception:
                pass
            
            # Final fallback
            return {
                "success": False,
                "error": "Could not extract text from DOC/DOCX file. Please try converting to PDF or text format.",
                "extracted_text": None
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"DOC extraction failed: {str(e)}",
                "extracted_text": None
            }
    
    def get_supported_formats(self) -> Dict[str, Any]:
        """
        Get list of supported file formats
        """
        return {
            "supported_formats": {
                "images": self.supported_image_types,
                "pdfs": self.supported_pdf_types,
                "text": self.supported_text_types,
                "documents": self.supported_doc_types
            },
            "max_file_size_mb": self.max_file_size / (1024 * 1024),
            "extraction_methods": ["google_vision_api", "pymupdf"],
            "recommended_formats": [".pdf", ".png", ".jpg", ".jpeg"]
        }

# Example usage and testing
if __name__ == "__main__":
    # Test the service
    ocr_service = OCRService()
    
    # Test with a sample file (you would need to provide a real file)
    print("Supported formats:", ocr_service.get_supported_formats())
    
    # Example usage:
    # result = ocr_service.extract_text_from_file("path/to/document.pdf")
    # print("OCR Result:", result)
