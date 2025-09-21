"""
Demo Service for NyayDarpan
Provides realistic demo responses when API keys are not available
"""

import json
from typing import Dict, Any
from datetime import datetime

class DemoGeminiService:
    """Demo service that provides realistic contract analysis responses"""
    
    def __init__(self):
        self.model_name = "demo-mode"
    
    def ultra_contract_analysis(self, contract_text: str, contract_type: str = "general") -> Dict[str, Any]:
        """Provide a realistic demo analysis"""
        
        # Analyze the contract text to provide relevant demo response
        is_employment = "employee" in contract_text.lower() or "employer" in contract_text.lower() or "work" in contract_text.lower()
        is_rental = "rent" in contract_text.lower() or "lease" in contract_text.lower() or "tenant" in contract_text.lower()
        
        if is_employment:
            return self._get_employment_demo_analysis(contract_text)
        elif is_rental:
            return self._get_rental_demo_analysis(contract_text)
        else:
            return self._get_general_demo_analysis(contract_text)
    
    def _get_employment_demo_analysis(self, contract_text: str) -> Dict[str, Any]:
        """Demo analysis for employment contracts"""
        return {
            "success": True,
            "analysis": {
                "executive_summary": {
                    "overall_risk_level": "high",
                    "legal_enforceability": "low",
                    "recommendation": "do_not_sign",
                    "risk_score": 85,
                    "key_findings": [
                        "Multiple violations of Indian labor laws detected",
                        "Working hours exceed legal limits",
                        "Unfair termination clauses identified",
                        "Lack of proper notice period requirements"
                    ],
                    "immediate_concerns": [
                        "This contract violates the Factories Act, 1948",
                        "Termination clauses are not compliant with Industrial Disputes Act, 1947"
                    ]
                },
                "legal_compliance_audit": {
                    "indian_contract_act_1872": {
                        "compliance_status": "non-compliant",
                        "violations": [
                            {
                                "section": "10",
                                "violation": "Unfair contract terms",
                                "impact": "Contract can be challenged in court"
                            }
                        ]
                    },
                    "sector_specific_laws": {
                        "employment_law": {
                            "factories_act_1948": "Violation: Working hours exceed 48 hours per week",
                            "industrial_disputes_act_1947": "Violation: No notice period for termination",
                            "minimum_wages_act_1948": "Compliance status needs verification"
                        }
                    }
                },
                "advanced_risk_analysis": {
                    "enforceability_assessment": {
                        "overall_enforceability": 15,
                        "court_likelihood": "high",
                        "defense_strength": "weak"
                    },
                    "loophole_analysis": [
                        {
                            "loophole_type": "unfair_terms",
                            "description": "Contract heavily favors employer",
                            "exploitation_potential": "high",
                            "mitigation_strategy": "Negotiate fair terms"
                        }
                    ]
                },
                "financial_impact_analysis": {
                    "cost_implications": {
                        "penalty_risks": [
                            {
                                "violation": "Factories Act, 1948",
                                "potential_penalty": "Fine up to ₹10,000",
                                "probability": "high"
                            }
                        ]
                    }
                },
                "action_plan": {
                    "immediate_actions": [
                        {
                            "action": "Consult with labor law attorney",
                            "priority": "high",
                            "timeline": "immediately"
                        }
                    ],
                    "legal_consultation_needed": {
                        "required": True,
                        "urgency": "immediate",
                        "specialization": "Labor law and employment contracts"
                    }
                },
                "confidence_metrics": {
                    "analysis_confidence": 85,
                    "legal_accuracy": 90,
                    "completeness": 80
                }
            },
            "analysis_depth": "demo-mode",
            "model_used": "demo-service",
            "timestamp": datetime.now().isoformat()
        }
    
    def _get_rental_demo_analysis(self, contract_text: str) -> Dict[str, Any]:
        """Demo analysis for rental contracts"""
        return {
            "success": True,
            "analysis": {
                "executive_summary": {
                    "overall_risk_level": "medium",
                    "legal_enforceability": "medium",
                    "recommendation": "review_and_negotiate",
                    "risk_score": 60,
                    "key_findings": [
                        "Standard rental agreement terms detected",
                        "Some clauses may need clarification",
                        "Security deposit terms appear reasonable"
                    ]
                },
                "legal_compliance_audit": {
                    "rent_control_acts": {
                        "compliance_status": "mostly_compliant",
                        "notes": "Standard rental agreement format"
                    }
                },
                "action_plan": {
                    "immediate_actions": [
                        {
                            "action": "Review terms with legal expert",
                            "priority": "medium",
                            "timeline": "within_week"
                        }
                    ]
                },
                "confidence_metrics": {
                    "analysis_confidence": 75,
                    "legal_accuracy": 80,
                    "completeness": 70
                }
            },
            "analysis_depth": "demo-mode",
            "model_used": "demo-service",
            "timestamp": datetime.now().isoformat()
        }
    
    def _get_general_demo_analysis(self, contract_text: str) -> Dict[str, Any]:
        """Demo analysis for general contracts"""
        return {
            "success": True,
            "analysis": {
                "executive_summary": {
                    "overall_risk_level": "medium",
                    "legal_enforceability": "medium",
                    "recommendation": "review_before_signing",
                    "risk_score": 50,
                    "key_findings": [
                        "General contract terms detected",
                        "Some clauses may need legal review",
                        "Standard contract structure identified"
                    ]
                },
                "legal_compliance_audit": {
                    "indian_contract_act_1872": {
                        "compliance_status": "review_needed",
                        "notes": "Basic contract elements present"
                    }
                },
                "action_plan": {
                    "immediate_actions": [
                        {
                            "action": "Get legal review before signing",
                            "priority": "medium",
                            "timeline": "before_execution"
                        }
                    ]
                },
                "confidence_metrics": {
                    "analysis_confidence": 70,
                    "legal_accuracy": 75,
                    "completeness": 65
                }
            },
            "analysis_depth": "demo-mode",
            "model_used": "demo-service",
            "timestamp": datetime.now().isoformat()
        }
