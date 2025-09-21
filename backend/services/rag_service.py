"""
RAG Service for Karma Check - Behavioral Risk Analysis
Searches and analyzes legal cases from Indian Kanoon data
"""

import os
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv
import json
import requests
from datetime import datetime
import re

load_dotenv()

class KarmaCheckRAGService:
    def __init__(self):
        # Initialize with basic configuration
        self.kanoon_base_url = "https://indiankanoon.org"
        self.case_database = []  # Will be populated from scraped data
        self.embeddings_model = None  # Will be initialized when needed
        
        # Load scraped cases from file
        self._load_scraped_cases()
        
        # Risk assessment criteria
        self.risk_indicators = {
            "high_risk": [
                "fraud", "misrepresentation", "breach of contract", "non-payment",
                "default", "litigation", "court case", "dispute", "arbitration"
            ],
            "medium_risk": [
                "delay", "extension", "modification", "amendment", "renegotiation"
            ],
            "low_risk": [
                "successful completion", "on-time delivery", "positive review"
            ]
        }
    
    def _load_scraped_cases(self):
        """Load scraped cases from the most recent JSON file"""
        try:
            import glob
            # Find the most recent scraped cases file
            case_files = glob.glob("scraped_cases_*.json")
            if case_files:
                latest_file = max(case_files, key=os.path.getctime)
                with open(latest_file, 'r', encoding='utf-8') as f:
                    self.case_database = json.load(f)
                print(f"Loaded {len(self.case_database)} cases from {latest_file}")
            else:
                print("No scraped cases found. Run the scraping script first.")
        except Exception as e:
            print(f"Error loading scraped cases: {e}")
            self.case_database = []
    
    def search_company_history(self, company_name: str, limit: int = 10) -> Dict[str, Any]:
        """
        Search for legal cases involving the company
        
        Args:
            company_name: Name of the company to search for
            limit: Maximum number of results to return
            
        Returns:
            Dictionary containing search results and risk assessment
        """
        try:
            # Search in the case database
            relevant_cases = self._search_cases_by_company(company_name, limit)
            
            if not relevant_cases:
                return {
                    "success": True,
                    "company": company_name,
                    "risk_score": 1,
                    "risk_level": "low",
                    "cases_found": 0,
                    "summary": f"No legal cases found for {company_name}",
                    "recommendations": [
                        "This is a positive sign - no public legal disputes found",
                        "Consider conducting additional due diligence",
                        "Check for any recent business registration or name changes"
                    ]
                }
            
            # Analyze the cases for risk assessment
            risk_analysis = self._analyze_case_risk(relevant_cases)
            
            # Generate summary and recommendations
            summary = self._generate_risk_summary(company_name, relevant_cases, risk_analysis)
            recommendations = self._generate_recommendations(risk_analysis)
            
            return {
                "success": True,
                "company": company_name,
                "risk_score": risk_analysis["overall_risk_score"],
                "risk_level": risk_analysis["risk_level"],
                "cases_found": len(relevant_cases),
                "cases": relevant_cases,
                "risk_analysis": risk_analysis,
                "summary": summary,
                "recommendations": recommendations,
                "last_updated": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "company": company_name,
                "risk_score": 5,  # Neutral score on error
                "risk_level": "unknown"
            }
    
    def _search_cases_by_company(self, company_name: str, limit: int) -> List[Dict[str, Any]]:
        """
        Search for cases involving the company name
        This is a placeholder implementation - in production, you'd query your vector database
        """
        # Placeholder implementation - replace with actual database query
        # For now, return mock data based on company name patterns
        
        mock_cases = []
        
        # Simple pattern matching for demo purposes
        if "tech" in company_name.lower() or "software" in company_name.lower():
            mock_cases = [
                {
                    "case_id": "2023_SC_12345",
                    "title": "Software License Dispute",
                    "court": "Supreme Court of India",
                    "year": 2023,
                    "status": "Resolved",
                    "outcome": "Settlement reached",
                    "relevance_score": 0.85,
                    "summary": "Dispute over software licensing terms and payment delays"
                }
            ]
        elif "finance" in company_name.lower() or "bank" in company_name.lower():
            mock_cases = [
                {
                    "case_id": "2022_HC_67890",
                    "title": "Financial Services Compliance",
                    "court": "High Court",
                    "year": 2022,
                    "status": "Ongoing",
                    "outcome": "Pending",
                    "relevance_score": 0.92,
                    "summary": "Regulatory compliance issues with financial services"
                }
            ]
        
        return mock_cases[:limit]
    
    def _analyze_case_risk(self, cases: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze cases to determine risk level
        """
        if not cases:
            return {
                "overall_risk_score": 1,
                "risk_level": "low",
                "risk_factors": [],
                "positive_factors": ["No legal disputes found"]
            }
        
        risk_score = 1
        risk_factors = []
        positive_factors = []
        
        for case in cases:
            # Analyze case outcome
            if case["status"] == "Ongoing":
                risk_score += 2
                risk_factors.append(f"Ongoing case: {case['title']}")
            elif "breach" in case["summary"].lower() or "fraud" in case["summary"].lower():
                risk_score += 3
                risk_factors.append(f"Serious allegations: {case['title']}")
            elif case["outcome"] == "Settlement reached":
                risk_score += 1
                risk_factors.append(f"Settlement case: {case['title']}")
            elif "successful" in case["summary"].lower():
                positive_factors.append(f"Positive outcome: {case['title']}")
        
        # Determine risk level
        if risk_score >= 7:
            risk_level = "high"
        elif risk_score >= 4:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return {
            "overall_risk_score": min(risk_score, 10),
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "positive_factors": positive_factors
        }
    
    def _generate_risk_summary(self, company_name: str, cases: List[Dict[str, Any]], risk_analysis: Dict[str, Any]) -> str:
        """
        Generate a human-readable risk summary
        """
        risk_level = risk_analysis["risk_level"]
        case_count = len(cases)
        
        if risk_level == "high":
            return f"⚠️ HIGH RISK: {company_name} has {case_count} legal case(s) with serious allegations including breach of contract or fraud. Exercise caution before entering into agreements."
        elif risk_level == "medium":
            return f"⚡ MEDIUM RISK: {company_name} has {case_count} legal case(s) including ongoing disputes or settlements. Consider additional due diligence."
        else:
            return f"✅ LOW RISK: {company_name} has minimal legal history or positive outcomes. Generally safe for business relationships."
    
    def _generate_recommendations(self, risk_analysis: Dict[str, Any]) -> List[str]:
        """
        Generate actionable recommendations based on risk analysis
        """
        recommendations = []
        risk_level = risk_analysis["risk_level"]
        
        if risk_level == "high":
            recommendations.extend([
                "Conduct thorough due diligence before signing any contract",
                "Consider adding stronger termination clauses",
                "Request additional guarantees or insurance",
                "Consult with a legal expert",
                "Monitor for any new legal developments"
            ])
        elif risk_level == "medium":
            recommendations.extend([
                "Review all contract terms carefully",
                "Consider shorter contract durations",
                "Add clear dispute resolution mechanisms",
                "Request regular performance reports",
                "Maintain detailed documentation"
            ])
        else:
            recommendations.extend([
                "Standard contract terms should be sufficient",
                "Maintain regular communication",
                "Keep records of all interactions"
            ])
        
        return recommendations
    
    def add_case_data(self, case_data: Dict[str, Any]) -> bool:
        """
        Add new case data to the database
        This would integrate with your vector database in production
        """
        try:
            self.case_database.append(case_data)
            return True
        except Exception as e:
            print(f"Error adding case data: {e}")
            return False
    
    def get_risk_indicators(self) -> Dict[str, Any]:
        """
        Get the risk assessment criteria
        """
        return {
            "risk_indicators": self.risk_indicators,
            "scoring_method": "Weighted scoring based on case outcomes and allegations",
            "data_sources": ["Indian Kanoon", "Court records", "Legal databases"]
        }

# Example usage and testing
if __name__ == "__main__":
    # Test the service
    rag_service = KarmaCheckRAGService()
    
    # Test with sample company
    result = rag_service.search_company_history("TechCorp India", limit=5)
    print("Karma Check Result:", json.dumps(result, indent=2))
    
    # Show risk indicators
    indicators = rag_service.get_risk_indicators()
    print("\nRisk Indicators:", json.dumps(indicators, indent=2))
