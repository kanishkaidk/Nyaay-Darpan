"""
Enhanced Gemini Service for NyayDarpan
Advanced contract analysis with few-shot prompting and fusion capabilities
"""

import google.generativeai as genai
from typing import Dict, List, Any, Optional
import os
import json
from dotenv import load_dotenv

load_dotenv()

class EnhancedGeminiService:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Few-shot examples for better contract analysis
        self.few_shot_examples = self._get_few_shot_examples()
        
    def _get_few_shot_examples(self) -> List[Dict]:
        """Get few-shot examples for better prompting"""
        return [
            {
                "contract_example": """
                EMPLOYMENT AGREEMENT
                Employee shall work 60 hours per week. Maximum working hours shall be 40 per week.
                Employer may terminate at any time without notice.
                """,
                "analysis_example": {
                    "overall_risk_score": 9,
                    "critical_issues": [
                        {
                            "issue": "Conflicting Working Hours",
                            "severity": "high",
                            "clause_reference": "Hours clause",
                            "explanation": "Contract states both 60 and 40 hours - clear contradiction",
                            "recommendation": "Clarify actual working hours and comply with labor laws"
                        }
                    ],
                    "contradictions": [
                        {
                            "contradiction": "Working hours discrepancy",
                            "clause_1": "60 hours per week",
                            "clause_2": "40 hours maximum",
                            "resolution": "Specify standard hours and overtime provisions"
                        }
                    ]
                }
            },
            {
                "contract_example": """
                RENTAL AGREEMENT
                Tenant pays ₹50,000 monthly. Security deposit of ₹2,00,000.
                Landlord may keep entire deposit for any damages.
                """,
                "analysis_example": {
                    "overall_risk_score": 7,
                    "unfair_clauses": [
                        {
                            "clause": "Landlord may keep entire deposit for any damages",
                            "issue_type": "liability_limitation",
                            "explanation": "Too broad - should specify types of damages",
                            "suggestion": "Limit to actual damages with proof"
                        }
                    ],
                    "missing_protections": [
                        {
                            "protection": "Deposit return conditions",
                            "importance": "Protects tenant from unfair deductions",
                            "suggestion": "Specify timeline and conditions for deposit return"
                        }
                    ]
                }
            }
        ]
    
    def analyze_contract_xray(self, contract_text: str) -> Dict[str, Any]:
        """
        Advanced contract X-Ray analysis with few-shot prompting
        """
        few_shot_context = self._build_few_shot_context()
        
        enhanced_prompt = f"""
{few_shot_context}

You are an expert Indian legal AI specializing in contract analysis. Your task is to perform a comprehensive "X-Ray" scan of the provided contract, identifying hidden risks, contradictions, and unfair clauses.

CONTRACT TO ANALYZE:
{contract_text}

Provide your analysis in the following JSON format:

{{
    "overall_risk_score": <number from 1-10>,
    "risk_summary": "<2-3 sentence summary>",
    "critical_issues": [
        {{
            "issue": "<description>",
            "severity": "<high/medium/low>",
            "clause_reference": "<specific clause/section>",
            "explanation": "<why problematic in simple language>",
            "recommendation": "<specific action user should take>",
            "legal_basis": "<relevant Indian law>"
        }}
    ],
    "unfair_clauses": [
        {{
            "clause": "<exact clause text or reference>",
            "issue_type": "<liability_limitation/penalty/termination/unilateral/etc>",
            "explanation": "<why unfair>",
            "suggestion": "<negotiation point or alternative>",
            "legal_violation": "<which law it violates>"
        }}
    ],
    "contradictions": [
        {{
            "contradiction": "<description of contradiction>",
            "clause_1": "<first conflicting clause>",
            "clause_2": "<second conflicting clause>",
            "resolution": "<how to resolve>",
            "impact": "<what happens if not resolved>"
        }}
    ],
    "missing_protections": [
        {{
            "protection": "<what's missing>",
            "importance": "<why important>",
            "suggestion": "<how to add>",
            "legal_requirement": "<if legally required>"
        }}
    ],
    "key_terms_summary": {{
        "payment_terms": "<payment structure and timing>",
        "termination_conditions": "<how contract ends>",
        "liability_limits": "<damage limitations>",
        "dispute_resolution": "<how conflicts resolved>",
        "intellectual_property": "<IP rights>",
        "confidentiality": "<secrecy obligations>",
        "force_majeure": "<unforeseen circumstances>"
    }},
    "compliance_check": {{
        "indian_contract_act": "<compliance status>",
        "consumer_protection": "<if applicable>",
        "employment_law": "<if applicable>",
        "data_protection": "<if applicable>"
    }},
    "recommendations": [
        "<specific actionable items>"
    ],
    "red_flags": [
        "<immediate warning signs>"
    ]
}}

Focus on:
1. Indian Contract Act, 1872 compliance
2. Consumer Protection Act, 2019 (if applicable)
3. Industrial Disputes Act, 1947 (employment)
4. Data Protection Bill, 2021
5. State-specific laws (if mentioned)

Be thorough, specific, and use plain language. Every insight should be actionable.
"""
        
        try:
            response = self.model.generate_content(enhanced_prompt)
            analysis_result = self._parse_gemini_response(response.text)
            
            return {
                "success": True,
                "analysis": analysis_result,
                "model_used": "gemini-1.5-flash-enhanced",
                "timestamp": self._get_timestamp()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "analysis": None
            }
    
    def _build_few_shot_context(self) -> str:
        """Build few-shot context from examples"""
        context = "Here are examples of contract analysis:\n\n"
        
        for example in self.few_shot_examples:
            context += f"EXAMPLE CONTRACT:\n{example['contract_example']}\n"
            context += f"ANALYSIS:\n{json.dumps(example['analysis_example'], indent=2)}\n\n"
        
        context += "Now analyze the following contract using the same detailed approach:\n"
        return context
    
    def generate_fusion_report(self, 
                             contract_analysis: Dict,
                             karma_check: Dict,
                             people_ledger: Dict = None,
                             contract_text: str = None) -> Dict[str, Any]:
        """
        Generate the master fusion report combining all data sources
        """
        
        fusion_prompt = f"""
You are NyayDarpan, an AI legal assistant that provides comprehensive contract intelligence. Combine the following analyses into one master report that tells the complete story.

CONTRACT X-RAY ANALYSIS:
{json.dumps(contract_analysis, indent=2)}

KARMA CHECK (BEHAVIORAL RISK):
{json.dumps(karma_check, indent=2)}

PEOPLE'S LEDGER (COMMUNITY INTELLIGENCE):
{json.dumps(people_ledger or {}, indent=2)}

Create a comprehensive fusion report in this JSON format:

{{
    "executive_summary": {{
        "overall_risk_level": "<low/medium/high/critical>",
        "risk_score": <1-10>,
        "key_findings": ["<top 3 findings>"],
        "recommendation": "<sign/don't sign/negotiate first>"
    }},
    "xray_findings": {{
        "critical_issues": <from contract analysis>,
        "unfair_clauses": <from contract analysis>,
        "contradictions": <from contract analysis>,
        "missing_protections": <from contract analysis>
    }},
    "karma_check_findings": {{
        "company_reputation": "<summary of legal history>",
        "risk_patterns": ["<patterns in past behavior>"],
        "similar_cases": <relevant cases found>
    }},
    "community_intelligence": {{
        "user_reviews_summary": "<summary of community feedback>",
        "common_issues": ["<recurring problems>"],
        "trust_indicators": ["<positive/negative signals>"]
    }},
    "integrated_risk_assessment": {{
        "document_risk": <contract risk score>,
        "behavioral_risk": <company risk score>,
        "community_risk": <user feedback risk score>,
        "combined_risk": <final risk score>,
        "risk_factors": ["<all risk factors combined>"]
    }},
    "action_plan": {{
        "immediate_actions": ["<urgent steps>"],
        "negotiation_points": ["<what to negotiate>"],
        "legal_consultation": "<if needed>",
        "alternative_actions": ["<other options>"]
    }},
    "confidence_metrics": {{
        "analysis_confidence": <0-100>,
        "data_completeness": <0-100>,
        "recommendation_strength": "<strong/medium/weak>"
    }}
}}

Provide actionable, specific guidance that empowers the user to make informed decisions.
"""
        
        try:
            response = self.model.generate_content(fusion_prompt)
            fusion_result = self._parse_gemini_response(response.text)
            
            return {
                "success": True,
                "fusion_report": fusion_result,
                "timestamp": self._get_timestamp()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "fusion_report": None
            }
    
    def chat_with_document(self, contract_text: str, user_question: str, chat_history: List[Dict] = None) -> Dict[str, Any]:
        """
        Chat with document functionality using RAG
        """
        
        # Build context from contract
        contract_context = f"""
CONTRACT CONTEXT:
{contract_text[:2000]}...

CHAT HISTORY:
{json.dumps(chat_history or [], indent=2) if chat_history else "No previous conversation"}

USER QUESTION: {user_question}
"""
        
        chat_prompt = f"""
You are NyayDarpan's document assistant. Answer the user's question based on the contract text provided.

{contract_context}

Provide a helpful, accurate response in JSON format:

{{
    "answer": "<your response to the user's question>",
    "confidence": "<high/medium/low>",
    "relevant_clauses": ["<clause references>"],
    "follow_up_questions": ["<helpful follow-up questions>"],
    "requires_legal_advice": <true/false>,
    "source": "contract_analysis"
}}

Be conversational but accurate. If you're not sure, say so.
"""
        
        try:
            response = self.model.generate_content(chat_prompt)
            chat_result = self._parse_gemini_response(response.text)
            
            return {
                "success": True,
                "chat_response": chat_result,
                "timestamp": self._get_timestamp()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "chat_response": None
            }
    
    def _parse_gemini_response(self, response_text: str) -> Dict[str, Any]:
        """Parse Gemini's response and extract JSON"""
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
                    "error": "Unable to parse AI response",
                    "raw_response": response_text
                }
        except json.JSONDecodeError:
            return {
                "error": "JSON parsing failed",
                "raw_response": response_text
            }
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()

# Example usage
if __name__ == "__main__":
    service = EnhancedGeminiService()
    
    sample_contract = """
    EMPLOYMENT AGREEMENT
    Employee shall work 60 hours per week. Maximum working hours shall be 40 per week.
    Employer may terminate at any time without notice.
    Employee is liable for all damages regardless of fault.
    """
    
    result = service.analyze_contract_xray(sample_contract)
    print("Enhanced Analysis:", json.dumps(result, indent=2))
