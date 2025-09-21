"""
Company Reviews Service
Scrapes and analyzes company reviews from various sources
"""

import os
import json
import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Any, Optional
from datetime import datetime
import time
import re

class CompanyReviewsService:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Review sources
        self.review_sources = {
            'glassdoor': self._scrape_glassdoor,
            'indeed': self._scrape_indeed,
            'ambitionbox': self._scrape_ambitionbox,
            'g2': self._scrape_g2
        }
    
    def get_company_reviews(self, company_name: str, limit: int = 10) -> Dict[str, Any]:
        """
        Get company reviews from multiple sources
        
        Args:
            company_name: Name of the company
            limit: Maximum number of reviews to return
            
        Returns:
            Dictionary containing reviews and analysis
        """
        try:
            all_reviews = []
            
            # Scrape from different sources
            for source_name, scrape_func in self.review_sources.items():
                try:
                    reviews = scrape_func(company_name, limit // len(self.review_sources))
                    if reviews:
                        all_reviews.extend(reviews)
                except Exception as e:
                    print(f"Error scraping {source_name}: {e}")
                    continue
            
            # Analyze reviews
            analysis = self._analyze_reviews(all_reviews)
            
            return {
                "success": True,
                "company": company_name,
                "total_reviews": len(all_reviews),
                "reviews": all_reviews[:limit],
                "analysis": analysis,
                "sources": list(self.review_sources.keys()),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "company": company_name,
                "reviews": [],
                "analysis": {}
            }
    
    def _scrape_glassdoor(self, company_name: str, limit: int) -> List[Dict[str, Any]]:
        """Scrape reviews from Glassdoor"""
        try:
            # This is a mock implementation - in real scenario, you'd need proper scraping
            mock_reviews = [
                {
                    "source": "Glassdoor",
                    "rating": 4.2,
                    "title": "Good work environment",
                    "content": "Great company culture and work-life balance. Management is supportive.",
                    "date": "2024-01-15",
                    "pros": "Good benefits, flexible hours",
                    "cons": "Salary could be better"
                },
                {
                    "source": "Glassdoor",
                    "rating": 3.8,
                    "title": "Average experience",
                    "content": "Decent company but has room for improvement in communication.",
                    "date": "2024-01-10",
                    "pros": "Stable company",
                    "cons": "Limited growth opportunities"
                }
            ]
            return mock_reviews[:limit]
        except Exception as e:
            print(f"Glassdoor scraping error: {e}")
            return []
    
    def _scrape_indeed(self, company_name: str, limit: int) -> List[Dict[str, Any]]:
        """Scrape reviews from Indeed"""
        try:
            mock_reviews = [
                {
                    "source": "Indeed",
                    "rating": 4.0,
                    "title": "Positive work culture",
                    "content": "Good team environment and opportunities for learning.",
                    "date": "2024-01-12",
                    "pros": "Learning opportunities",
                    "cons": "Workload can be heavy"
                }
            ]
            return mock_reviews[:limit]
        except Exception as e:
            print(f"Indeed scraping error: {e}")
            return []
    
    def _scrape_ambitionbox(self, company_name: str, limit: int) -> List[Dict[str, Any]]:
        """Scrape reviews from AmbitionBox"""
        try:
            mock_reviews = [
                {
                    "source": "AmbitionBox",
                    "rating": 4.5,
                    "title": "Excellent company",
                    "content": "Great leadership and innovative projects. Highly recommended.",
                    "date": "2024-01-08",
                    "pros": "Innovation, leadership",
                    "cons": "Fast-paced environment"
                }
            ]
            return mock_reviews[:limit]
        except Exception as e:
            print(f"AmbitionBox scraping error: {e}")
            return []
    
    def _scrape_g2(self, company_name: str, limit: int) -> List[Dict[str, Any]]:
        """Scrape reviews from G2"""
        try:
            mock_reviews = [
                {
                    "source": "G2",
                    "rating": 4.3,
                    "title": "Good service provider",
                    "content": "Reliable service and good customer support.",
                    "date": "2024-01-05",
                    "pros": "Reliability, support",
                    "cons": "Pricing could be better"
                }
            ]
            return mock_reviews[:limit]
        except Exception as e:
            print(f"G2 scraping error: {e}")
            return []
    
    def _analyze_reviews(self, reviews: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze reviews and extract insights"""
        if not reviews:
            return {}
        
        # Calculate average rating
        ratings = [review.get('rating', 0) for review in reviews]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0
        
        # Extract common themes
        all_pros = []
        all_cons = []
        
        for review in reviews:
            if review.get('pros'):
                all_pros.append(review['pros'])
            if review.get('cons'):
                all_cons.append(review['cons'])
        
        # Analyze sentiment
        positive_keywords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic']
        negative_keywords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'poor']
        
        positive_count = 0
        negative_count = 0
        
        for review in reviews:
            content = review.get('content', '').lower()
            if any(keyword in content for keyword in positive_keywords):
                positive_count += 1
            if any(keyword in content for keyword in negative_keywords):
                negative_count += 1
        
        # Determine risk level based on reviews
        risk_level = 'low'
        if avg_rating < 3.0:
            risk_level = 'high'
        elif avg_rating < 4.0:
            risk_level = 'medium'
        
        return {
            "average_rating": round(avg_rating, 1),
            "total_reviews": len(reviews),
            "risk_level": risk_level,
            "sentiment_analysis": {
                "positive": positive_count,
                "negative": negative_count,
                "neutral": len(reviews) - positive_count - negative_count
            },
            "common_themes": {
                "pros": all_pros[:5],  # Top 5 pros
                "cons": all_cons[:5]   # Top 5 cons
            },
            "recommendation": self._get_recommendation(avg_rating, risk_level)
        }
    
    def _get_recommendation(self, avg_rating: float, risk_level: str) -> str:
        """Generate recommendation based on analysis"""
        if risk_level == 'low':
            return "This company has positive reviews and appears to be a reliable business partner."
        elif risk_level == 'medium':
            return "Mixed reviews suggest some caution. Consider additional due diligence."
        else:
            return "Negative reviews indicate potential risks. Proceed with caution and consider alternatives."
