"""
Ultra-Enhanced Gemini Service for NyayDarpan
Maximum intensity contract analysis with advanced legal reasoning
"""

import google.generativeai as genai
from typing import Dict, List, Any, Optional
import os
import json
from dotenv import load_dotenv

load_dotenv()

class UltraGeminiService:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Advanced few-shot examples with legal precedents
        self.advanced_examples = self._get_advanced_examples()
        
    def _get_advanced_examples(self) -> List[Dict]:
        """Get advanced few-shot examples with legal precedents"""
        return [
            {
                "contract_type": "employment",
                "contract_text": """
                EMPLOYMENT AGREEMENT
                Employee shall work 60 hours per week. Maximum working hours shall be 40 per week.
                Employer may terminate at any time without notice.
                Employee is liable for all damages regardless of fault.
                All disputes resolved through company arbitration only.
                """,
                "analysis": {
                    "legal_violations": [
                        {
                            "law": "Factories Act, 1948",
                            "violation": "Working hours exceed 48 hours per week",
                            "penalty": "Fine up to ₹10,000 or imprisonment up to 6 months",
                            "clause": "60 hours per week requirement"
                        },
                        {
                            "law": "Industrial Disputes Act, 1947",
                            "violation": "No notice period for termination",
                            "penalty": "Compensation equal to 15 days wages per year",
                            "clause": "Terminate at any time without notice"
                        }
                    ],
                    "contradictions": [
                        {
                            "type": "working_hours_conflict",
                            "clause_1": "60 hours per week",
                            "clause_2": "40 hours maximum",
                            "legal_impact": "Violates labor laws and creates unenforceable terms",
                            "resolution": "Align with statutory 48-hour limit"
                        }
                    ],
                    "risk_assessment": {
                        "overall_risk": 9.5,
                        "legal_enforceability": "low",
                        "financial_risk": "high",
                        "reputation_risk": "high"
                    }
                }
            },
            {
                "contract_type": "rental",
                "contract_text": """
                RENTAL AGREEMENT
                Tenant pays ₹50,000 monthly. Security deposit ₹2,00,000.
                Landlord may keep entire deposit for any damages.
                Tenant responsible for all repairs and maintenance.
                No subletting allowed under any circumstances.
                """,
                "analysis": {
                    "legal_violations": [
                        {
                            "law": "Model Tenancy Act, 2021",
                            "violation": "Excessive security deposit (4 months rent)",
                            "penalty": "Refund excess amount with interest",
                            "clause": "₹2,00,000 security deposit"
                        },
                        {
                            "law": "Consumer Protection Act, 2019",
                            "violation": "Unfair contract terms",
                            "penalty": "Compensation up to ₹1,00,000",
                            "clause": "Landlord keeps entire deposit for any damages"
                        }
                    ],
                    "unfair_clauses": [
                        {
                            "clause": "Tenant responsible for all repairs",
                            "unfairness_type": "unreasonable_obligation",
                            "legal_basis": "Landlord's duty to maintain habitability",
                            "suggestion": "Limit to minor repairs, landlord handles major repairs"
                        }
                    ]
                }
            }
        ]
    
    def ultra_contract_analysis(self, contract_text: str, contract_type: str = "general") -> Dict[str, Any]:
        """
        Ultra-intensive contract analysis with legal precedents and case law
        """
        
        # Build comprehensive legal context
        legal_context = self._build_legal_context(contract_type)
        few_shot_examples = self._build_advanced_examples()
        
        ultra_prompt = f"""
{few_shot_examples}

{legal_context}

You are NyayDarpan, India's most advanced AI legal analyst. Perform a comprehensive, ultra-intensive analysis of this contract using advanced legal reasoning, case law knowledge, and regulatory compliance expertise.

CONTRACT TO ANALYZE:
{contract_text}

Provide an exhaustive analysis in this JSON format:

{{
    "executive_summary": {{
        "overall_risk_level": "<critical/high/medium/low>",
        "risk_score": <1-10>,
        "legal_enforceability": "<high/medium/low/none>",
        "recommendation": "<sign_immediately/sign_with_minor_changes/negotiate_major_changes/do_not_sign>",
        "key_findings": ["<top 5 critical findings>"],
        "immediate_concerns": ["<urgent issues requiring immediate attention>"]
    }},
    
    "legal_compliance_audit": {{
        "indian_contract_act_1872": {{
            "compliance_status": "<compliant/partially_compliant/non_compliant>",
            "violations": [
                {{
                    "section": "<specific section violated>",
                    "violation": "<description of violation>",
                    "impact": "<legal consequence>",
                    "clause_reference": "<relevant contract clause>"
                }}
            ],
            "missing_elements": ["<required elements not present>"]
        }},
        "sector_specific_laws": {{
            "employment_law": {{
                "factories_act_1948": "<compliance status and violations>",
                "industrial_disputes_act_1947": "<compliance status and violations>",
                "minimum_wages_act_1948": "<compliance status and violations>",
                "payment_of_wages_act_1936": "<compliance status and violations>"
            }},
            "consumer_protection": {{
                "consumer_protection_act_2019": "<compliance status and violations>",
                "unfair_trade_practices": "<identified practices>"
            }},
            "data_protection": {{
                "data_protection_bill_2021": "<compliance status>",
                "privacy_concerns": ["<identified issues>"]
            }}
        }},
        "state_specific_laws": {{
            "applicable_state_laws": ["<list of relevant state laws>"],
            "compliance_status": "<overall state law compliance>",
            "violations": ["<state law violations>"]
        }}
    }},
    
    "advanced_risk_analysis": {{
        "contradiction_matrix": [
            {{
                "contradiction_id": "<unique identifier>",
                "type": "<logical/legal/practical>",
                "clauses_involved": ["<list of conflicting clauses>"],
                "severity": "<critical/high/medium/low>",
                "legal_impact": "<how this affects enforceability>",
                "resolution_strategy": "<how to resolve>",
                "case_law_precedent": "<relevant legal precedent if any>"
            }}
        ],
        "loophole_analysis": [
            {{
                "loophole_type": "<ambiguity/omission/unfairness>",
                "description": "<detailed description>",
                "exploitation_potential": "<high/medium/low>",
                "affected_party": "<who benefits from this loophole>",
                "mitigation_strategy": "<how to close the loophole>"
            }}
        ],
        "enforceability_assessment": {{
            "overall_enforceability": "<percentage>",
            "problematic_clauses": ["<clauses that may not hold in court>"],
            "court_likelihood": "<how likely this would be challenged>",
            "defense_strength": "<how well each party can defend their position>"
        }}
    }},
    
    "financial_impact_analysis": {{
        "cost_implications": {{
            "direct_costs": ["<identifiable monetary costs>"],
            "hidden_costs": ["<indirect or hidden expenses>"],
            "penalty_risks": [
                {{
                    "violation": "<type of violation>",
                    "potential_penalty": "<amount or description>",
                    "probability": "<high/medium/low>"
                }}
            ]
        }},
        "liability_assessment": {{
            "maximum_liability": "<estimated maximum exposure>",
            "liability_distribution": "<how liability is shared>",
            "insurance_coverage": "<recommended coverage>"
        }}
    }},
    
    "negotiation_intelligence": {{
        "leverage_points": [
            {{
                "issue": "<negotiable point>",
                "your_leverage": "<your negotiating strength>",
                "their_vulnerability": "<their weak points>",
                "negotiation_strategy": "<recommended approach>"
            }}
        ],
        "concession_priority": [
            {{
                "concession": "<what to ask for>",
                "priority": "<high/medium/low>",
                "realistic_chance": "<probability of success>",
                "fallback_position": "<minimum acceptable>"
            }}
        ]
    }},
    
    "action_plan": {{
        "immediate_actions": [
            {{
                "action": "<specific step>",
                "timeline": "<when to do this>",
                "priority": "<high/medium/low>",
                "responsible_party": "<who should handle this>"
            }}
        ],
        "legal_consultation_needed": {{
            "required": <true/false>,
            "urgency": "<immediate/within_week/optional>",
            "specialization": "<type of lawyer needed>",
            "specific_issues": ["<issues to discuss with lawyer>"]
        }},
        "documentation_requirements": [
            {{
                "document": "<what to prepare>",
                "purpose": "<why needed>",
                "timeline": "<when needed>"
            }}
        ]
    }},
    
    "case_law_references": [
        {{
            "case_name": "<relevant case>",
            "court": "<which court>",
            "year": "<year of judgment>",
            "relevance": "<how it applies to this contract>",
            "precedent_set": "<what legal principle established>"
        }}
    ],
    
    "confidence_metrics": {{
        "analysis_confidence": <0-100>,
        "legal_accuracy": <0-100>,
        "completeness": <0-100>,
        "practical_applicability": <0-100>
    }}
}}

Focus Areas:
1. Indian Contract Act, 1872 - All sections
2. Consumer Protection Act, 2019
3. Employment laws (Factories Act, Industrial Disputes Act, etc.)
4. State-specific legislation
5. Supreme Court and High Court precedents
6. Recent legal developments and amendments
7. International best practices where applicable

Be extremely thorough, cite specific laws and sections, and provide actionable legal intelligence.
"""
        
        try:
            response = self.model.generate_content(ultra_prompt)
            analysis_result = self._parse_gemini_response(response.text)
            
            return {
                "success": True,
                "analysis": analysis_result,
                "model_used": "gemini-1.5-flash-ultra",
                "timestamp": self._get_timestamp(),
                "analysis_depth": "ultra-intensive"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "analysis": None
            }
    
    def _build_legal_context(self, contract_type: str) -> str:
        """Build comprehensive legal context"""
        
        legal_frameworks = {
            "employment": """
            EMPLOYMENT LAW FRAMEWORK (India):
            - Factories Act, 1948: Maximum 48 hours/week, overtime provisions
            - Industrial Disputes Act, 1947: Notice periods, retrenchment compensation
            - Minimum Wages Act, 1948: Wage floor requirements
            - Payment of Wages Act, 1936: Payment timing and deductions
            - Employees' State Insurance Act, 1948: Health insurance
            - Employees' Provident Fund Act, 1952: Retirement benefits
            - Maternity Benefit Act, 1961: Leave and benefits
            - Sexual Harassment of Women at Workplace Act, 2013: Workplace safety
            """,
            "rental": """
            RENTAL LAW FRAMEWORK (India):
            - Model Tenancy Act, 2021: Security deposit limits, maintenance responsibilities
            - Transfer of Property Act, 1882: Landlord-tenant rights
            - Rent Control Acts (State-specific): Rent regulation
            - Consumer Protection Act, 2019: Unfair contract terms
            - Registration Act, 1908: Registration requirements
            """,
            "general": """
            GENERAL CONTRACT LAW FRAMEWORK (India):
            - Indian Contract Act, 1872: Formation, validity, performance
            - Specific Relief Act, 1963: Remedies for breach
            - Consumer Protection Act, 2019: Consumer rights
            - Competition Act, 2002: Anti-competitive practices
            - Information Technology Act, 2000: Digital contracts
            - Arbitration and Conciliation Act, 2015: Dispute resolution
            """
        }
        
        return legal_frameworks.get(contract_type, legal_frameworks["general"])
    
    def _build_advanced_examples(self) -> str:
        """Build advanced few-shot examples"""
        context = "ADVANCED LEGAL ANALYSIS EXAMPLES:\n\n"
        
        for example in self.advanced_examples:
            context += f"CONTRACT TYPE: {example['contract_type'].upper()}\n"
            context += f"CONTRACT TEXT:\n{example['contract_text']}\n"
            context += f"ULTRA-INTENSIVE ANALYSIS:\n{json.dumps(example['analysis'], indent=2)}\n\n"
        
        return context
    
    def intelligent_chat_with_document(self, 
                                     contract_text: str, 
                                     user_question: str, 
                                     chat_history: List[Dict] = None,
                                     analysis_context: Dict = None) -> Dict[str, Any]:
        """
        Intelligent chat with document using full analysis context
        """
        
        # Build comprehensive context
        context_summary = self._build_context_summary(analysis_context) if analysis_context else ""
        history_context = self._build_chat_history(chat_history) if chat_history else ""
        
        chat_prompt = f"""
You are NyayDarpan, an expert Indian legal AI assistant with access to comprehensive contract analysis.

CONTRACT CONTEXT:
{contract_text[:3000]}...

{context_summary}

{history_context}

USER QUESTION: {user_question}

Provide an intelligent, legally-informed response in JSON format:

{{
    "answer": "<comprehensive, accurate response>",
    "confidence_level": "<high/medium/low>",
    "legal_citations": ["<relevant laws or cases mentioned>"],
    "relevant_clauses": ["<specific contract clauses referenced>"],
    "follow_up_questions": ["<helpful follow-up questions>"],
    "requires_legal_advice": <true/false>,
    "risk_level": "<high/medium/low>",
    "action_recommendations": ["<specific actions user should consider>"],
    "source_analysis": {{
        "contract_based": <true/false>,
        "legal_precedent": <true/false>,
        "regulatory_guidance": <true/false>
    }}
}}

Be conversational but legally accurate. If uncertain, clearly state limitations.
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
    
    def _build_context_summary(self, analysis_context: Dict) -> str:
        """Build context summary from analysis"""
        if not analysis_context:
            return ""
        
        summary = "ANALYSIS CONTEXT:\n"
        
        if 'executive_summary' in analysis_context:
            summary += f"Risk Level: {analysis_context['executive_summary'].get('overall_risk_level', 'Unknown')}\n"
            summary += f"Recommendation: {analysis_context['executive_summary'].get('recommendation', 'Unknown')}\n"
        
        if 'legal_compliance_audit' in analysis_context:
            compliance = analysis_context['legal_compliance_audit']
            if 'indian_contract_act_1872' in compliance:
                summary += f"Contract Act Compliance: {compliance['indian_contract_act_1872'].get('compliance_status', 'Unknown')}\n"
        
        return summary
    
    def _build_chat_history(self, chat_history: List[Dict]) -> str:
        """Build chat history context"""
        if not chat_history:
            return ""
        
        history = "CONVERSATION HISTORY:\n"
        for msg in chat_history[-5:]:  # Last 5 messages
            history += f"{msg.get('type', 'user')}: {msg.get('content', '')}\n"
        
        return history
    
    def _parse_gemini_response(self, response_text: str) -> Dict[str, Any]:
        """Parse Gemini's response and extract JSON"""
        import re
        
        try:
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
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
    service = UltraGeminiService()
    
    sample_contract = """
    EMPLOYMENT AGREEMENT
    Employee shall work 60 hours per week. Maximum working hours shall be 40 per week.
    Employer may terminate at any time without notice.
    Employee is liable for all damages regardless of fault.
    """
    
    result = service.ultra_contract_analysis(sample_contract, "employment")
    print("Ultra Analysis:", json.dumps(result, indent=2))
