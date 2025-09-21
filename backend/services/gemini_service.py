"""
Gemini Service for Contract X-Ray Analysis
Analyzes contracts to find contradictions, loopholes, and risks
"""

import google.generativeai as genai
from typing import Dict, List, Any
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiContractAnalyzer:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Contract analysis prompt
        self.analysis_prompt = """
You are an expert legal AI assistant specializing in Indian contract law. Your task is to analyze the provided contract text and identify potential risks, contradictions, and unfair clauses.

CONTRACT TEXT:
{contract_text}

Please provide a comprehensive analysis in the following JSON format:

{{
    "overall_risk_score": <number from 1-10, where 1=very low risk, 10=very high risk>,
    "risk_summary": "<brief 2-3 sentence summary of main risks>",
    "critical_issues": [
        {{
            "issue": "<description of the issue>",
            "severity": "<high/medium/low>",
            "clause_reference": "<relevant contract section/clause>",
            "explanation": "<why this is problematic in simple language>",
            "recommendation": "<what the user should do about it>"
        }}
    ],
    "unfair_clauses": [
        {{
            "clause": "<text or reference to unfair clause>",
            "issue_type": "<type of unfairness: liability_limitation/penalty/termination/etc>",
            "explanation": "<why this clause is unfair>",
            "suggestion": "<suggested alternative or negotiation point>"
        }}
    ],
    "contradictions": [
        {{
            "contradiction": "<description of contradictory terms>",
            "clause_1": "<first contradictory clause>",
            "clause_2": "<second contradictory clause>",
            "resolution": "<suggested way to resolve the contradiction>"
        }}
    ],
    "missing_protections": [
        {{
            "protection": "<what protection is missing>",
            "importance": "<why this protection is important>",
            "suggestion": "<how to add this protection>"
        }}
    ],
    "key_terms_summary": {{
        "payment_terms": "<summary of payment structure>",
        "termination_conditions": "<when/how contract can be terminated>",
        "liability_limits": "<any liability limitations>",
        "dispute_resolution": "<how disputes will be handled>",
        "intellectual_property": "<IP ownership and usage rights>"
    }},
    "recommendations": [
        "<specific action items for the user>"
    ]
}}

Focus on:
1. Indian Contract Act compliance
2. Consumer protection laws
3. Employment law (if applicable)
4. Data protection and privacy
5. Fair business practices

Be thorough but concise. Use simple language that non-lawyers can understand.
"""

    def analyze_contract(self, contract_text: str) -> Dict[str, Any]:
        """
        Analyze contract text for risks, contradictions, and unfair clauses
        
        Args:
            contract_text: The contract text to analyze
            
        Returns:
            Dictionary containing analysis results
        """
        try:
            # Prepare the prompt with contract text
            formatted_prompt = self.analysis_prompt.format(contract_text=contract_text)
            
            # Generate analysis
            response = self.model.generate_content(formatted_prompt)
            
            # Parse the JSON response
            analysis_result = self._parse_gemini_response(response.text)
            
            return {
                "success": True,
                "analysis": analysis_result,
                "model_used": "gemini-1.5-flash"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "analysis": None
            }
    
    def _parse_gemini_response(self, response_text: str) -> Dict[str, Any]:
        """
        Parse Gemini's response and extract JSON
        """
        import json
        import re
        
        try:
            # Try to find JSON in the response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
                # Fallback: return structured error response
                return {
                    "overall_risk_score": 5,
                    "risk_summary": "Unable to parse AI response properly",
                    "critical_issues": [],
                    "unfair_clauses": [],
                    "contradictions": [],
                    "missing_protections": [],
                    "key_terms_summary": {},
                    "recommendations": ["Please review the contract manually or try again"]
                }
        except json.JSONDecodeError:
            # Return a safe fallback structure
            return {
                "overall_risk_score": 5,
                "risk_summary": "Analysis completed but response format was unclear",
                "critical_issues": [],
                "unfair_clauses": [],
                "contradictions": [],
                "missing_protections": [],
                "key_terms_summary": {},
                "recommendations": ["Please review the contract manually"]
            }
    
    def get_contract_summary(self, contract_text: str) -> Dict[str, Any]:
        """
        Get a quick summary of contract terms
        
        Args:
            contract_text: The contract text to summarize
            
        Returns:
            Dictionary containing summary
        """
        summary_prompt = f"""
        Provide a concise summary of this contract in JSON format:
        
        CONTRACT TEXT:
        {contract_text}
        
        Return:
        {{
            "contract_type": "<type of contract>",
            "parties": "<who are the parties involved>",
            "main_purpose": "<what this contract is for>",
            "key_obligations": ["<list of main obligations>"],
            "payment_terms": "<how payment works>",
            "duration": "<how long the contract lasts>",
            "termination": "<how it can be ended>"
        }}
        """
        
        try:
            response = self.model.generate_content(summary_prompt)
            return {
                "success": True,
                "summary": self._parse_gemini_response(response.text)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "summary": None
            }

# Example usage and testing
if __name__ == "__main__":
    # Test the service
    analyzer = GeminiContractAnalyzer()
    
    sample_contract = """
    SERVICE AGREEMENT
    
    This agreement is between Company ABC and Service Provider XYZ.
    
    Terms:
    1. Service Provider will deliver services as specified.
    2. Payment will be made within 30 days of invoice.
    3. Company ABC reserves the right to terminate without notice.
    4. Service Provider is liable for all damages regardless of fault.
    5. All disputes will be resolved through arbitration in Mumbai.
    
    Signed: [Date]
    """
    
    result = analyzer.analyze_contract(sample_contract)
    print("Analysis Result:", result)
