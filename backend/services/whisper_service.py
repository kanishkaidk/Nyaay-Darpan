"""
Whisper Service for Speech-to-Text Conversion
Handles audio file transcription using OpenAI's Whisper API
"""

import openai
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv
import base64
import tempfile

load_dotenv()

class WhisperTranscriptionService:
    def __init__(self):
        # Configure OpenAI API
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        self.client = openai.OpenAI(api_key=api_key)
        
        # Supported audio formats
        self.supported_formats = [
            'mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'
        ]
        
        # Maximum file size (25MB for Whisper API)
        self.max_file_size = 25 * 1024 * 1024  # 25MB in bytes
    
    def transcribe_audio_file(self, audio_file_path: str, language: str = "auto") -> Dict[str, Any]:
        """
        Transcribe audio file to text using Whisper API
        
        Args:
            audio_file_path: Path to the audio file
            language: Language code (e.g., 'en', 'hi', 'auto')
            
        Returns:
            Dictionary containing transcription results
        """
        try:
            # Validate file exists
            if not os.path.exists(audio_file_path):
                return {
                    "success": False,
                    "error": "Audio file not found",
                    "transcription": None
                }
            
            # Check file size
            file_size = os.path.getsize(audio_file_path)
            if file_size > self.max_file_size:
                return {
                    "success": False,
                    "error": f"File too large. Maximum size is {self.max_file_size / (1024*1024):.1f}MB",
                    "transcription": None
                }
            
            # Check file format
            file_extension = audio_file_path.split('.')[-1].lower()
            if file_extension not in self.supported_formats:
                return {
                    "success": False,
                    "error": f"Unsupported format. Supported: {', '.join(self.supported_formats)}",
                    "transcription": None
                }
            
            # Prepare language parameter
            language_param = language if language != "auto" else None
            
            # Transcribe using Whisper API
            with open(audio_file_path, 'rb') as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language=language_param,
                    response_format="verbose_json"
                )
            
            return {
                "success": True,
                "transcription": {
                    "text": transcript.text,
                    "language": transcript.language,
                    "duration": transcript.duration,
                    "segments": getattr(transcript, 'segments', [])
                },
                "metadata": {
                    "model": "whisper-1",
                    "file_size": file_size,
                    "file_format": file_extension
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "transcription": None
            }
    
    def transcribe_base64_audio(self, base64_audio: str, language: str = "auto") -> Dict[str, Any]:
        """
        Transcribe base64 encoded audio data
        
        Args:
            base64_audio: Base64 encoded audio data
            language: Language code
            
        Returns:
            Dictionary containing transcription results
        """
        try:
            # Decode base64 audio
            audio_data = base64.b64decode(base64_audio)
            
            # Check size
            if len(audio_data) > self.max_file_size:
                return {
                    "success": False,
                    "error": f"Audio too large. Maximum size is {self.max_file_size / (1024*1024):.1f}MB",
                    "transcription": None
                }
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
                temp_file.write(audio_data)
                temp_file_path = temp_file.name
            
            try:
                # Transcribe using the temporary file
                result = self.transcribe_audio_file(temp_file_path, language)
                return result
            finally:
                # Clean up temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                    
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "transcription": None
            }
    
    def transcribe_with_analysis(self, audio_file_path: str, language: str = "auto") -> Dict[str, Any]:
        """
        Transcribe audio and provide additional analysis
        
        Args:
            audio_file_path: Path to the audio file
            language: Language code
            
        Returns:
            Dictionary containing transcription and analysis
        """
        # First, get the transcription
        transcription_result = self.transcribe_audio_file(audio_file_path, language)
        
        if not transcription_result["success"]:
            return transcription_result
        
        # Add analysis of the transcription
        text = transcription_result["transcription"]["text"]
        
        # Basic analysis
        analysis = {
            "word_count": len(text.split()),
            "character_count": len(text),
            "estimated_speaking_time": transcription_result["transcription"].get("duration", 0),
            "language_detected": transcription_result["transcription"]["language"],
            "confidence_indicators": {
                "has_punctuation": any(p in text for p in ['.', '!', '?']),
                "has_numbers": any(char.isdigit() for char in text),
                "has_proper_nouns": any(word[0].isupper() for word in text.split() if len(word) > 1)
            }
        }
        
        # Add analysis to result
        transcription_result["analysis"] = analysis
        
        return transcription_result
    
    def get_supported_languages(self) -> Dict[str, Any]:
        """
        Get list of supported languages for transcription
        
        Returns:
            Dictionary with supported languages
        """
        return {
            "supported_languages": {
                "english": "en",
                "hindi": "hi",
                "bengali": "bn",
                "telugu": "te",
                "marathi": "mr",
                "tamil": "ta",
                "gujarati": "gu",
                "urdu": "ur",
                "kannada": "kn",
                "odia": "or",
                "punjabi": "pa",
                "malayalam": "ml",
                "assamese": "as"
            },
            "auto_detection": True,
            "recommended_for_indian_languages": ["hi", "en", "auto"]
        }

# Example usage and testing
if __name__ == "__main__":
    # Test the service
    try:
        whisper_service = WhisperTranscriptionService()
        
        # Test with a sample audio file (you would need to provide a real file)
        print("Supported languages:", whisper_service.get_supported_languages())
        
        # Example usage:
        # result = whisper_service.transcribe_audio_file("path/to/audio.wav", "hi")
        # print("Transcription result:", result)
        
    except ValueError as e:
        print(f"Configuration error: {e}")
    except Exception as e:
        print(f"Service error: {e}")
