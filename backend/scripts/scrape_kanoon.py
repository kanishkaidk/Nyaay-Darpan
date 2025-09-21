"""
Indian Kanoon Scraper
Scrapes legal cases from Indian Kanoon for RAG database
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import os
from typing import List, Dict, Any
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IndianKanoonScraper:
    def __init__(self):
        self.base_url = "https://indiankanoon.org"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.scraped_cases = []
        
    def search_cases_by_keyword(self, keyword: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Search for cases by keyword
        
        Args:
            keyword: Search term
            limit: Maximum number of cases to scrape
            
        Returns:
            List of case dictionaries
        """
        try:
            search_url = f"{self.base_url}/search/?formInput={keyword}&sortby=1"
            
            logger.info(f"Searching for cases with keyword: {keyword}")
            response = self.session.get(search_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            cases = []
            
            # Find case result containers
            case_containers = soup.find_all('div', class_='result')
            
            for i, container in enumerate(case_containers[:limit]):
                if i >= limit:
                    break
                    
                case_data = self._extract_case_data(container)
                if case_data:
                    cases.append(case_data)
                    self.scraped_cases.append(case_data)
                
                # Be respectful - add delay between requests
                time.sleep(1)
            
            logger.info(f"Scraped {len(cases)} cases for keyword: {keyword}")
            return cases
            
        except Exception as e:
            logger.error(f"Error searching cases: {e}")
            return []
    
    def _extract_case_data(self, container) -> Dict[str, Any]:
        """
        Extract case data from HTML container
        """
        try:
            case_data = {}
            
            # Extract case title
            title_elem = container.find('a')
            if title_elem:
                case_data['title'] = title_elem.get_text(strip=True)
                case_data['url'] = f"{self.base_url}{title_elem.get('href', '')}"
            
            # Extract court and date
            meta_elem = container.find('div', class_='meta')
            if meta_elem:
                meta_text = meta_elem.get_text(strip=True)
                case_data['court'] = self._extract_court_name(meta_text)
                case_data['date'] = self._extract_date(meta_text)
            
            # Extract snippet
            snippet_elem = container.find('div', class_='snippet')
            if snippet_elem:
                case_data['snippet'] = snippet_elem.get_text(strip=True)
            
            # Add scraping metadata
            case_data['scraped_at'] = datetime.now().isoformat()
            case_data['source'] = 'Indian Kanoon'
            
            return case_data
            
        except Exception as e:
            logger.error(f"Error extracting case data: {e}")
            return None
    
    def _extract_court_name(self, meta_text: str) -> str:
        """Extract court name from meta text"""
        # Common court patterns
        court_patterns = [
            'Supreme Court', 'High Court', 'District Court',
            'Sessions Court', 'Family Court', 'Consumer Court'
        ]
        
        for pattern in court_patterns:
            if pattern in meta_text:
                return pattern
        
        return "Unknown Court"
    
    def _extract_date(self, meta_text: str) -> str:
        """Extract date from meta text"""
        import re
        
        # Date patterns
        date_patterns = [
            r'\d{1,2}[-\/]\d{1,2}[-\/]\d{4}',  # DD-MM-YYYY or DD/MM/YYYY
            r'\d{4}[-\/]\d{1,2}[-\/]\d{1,2}',  # YYYY-MM-DD or YYYY/MM/DD
            r'\d{1,2}\s+\w+\s+\d{4}'           # DD Month YYYY
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, meta_text)
            if match:
                return match.group()
        
        return "Date not found"
    
    def scrape_company_cases(self, company_name: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Scrape cases specifically mentioning a company name
        
        Args:
            company_name: Name of the company to search for
            limit: Maximum number of cases to scrape
            
        Returns:
            List of relevant cases
        """
        # Search with company name in quotes for exact matches
        search_terms = [
            f'"{company_name}"',
            f'{company_name} company',
            f'{company_name} ltd',
            f'{company_name} pvt ltd'
        ]
        
        all_cases = []
        
        for term in search_terms:
            cases = self.search_cases_by_keyword(term, limit // len(search_terms))
            all_cases.extend(cases)
            
            # Add delay between different search terms
            time.sleep(2)
        
        # Remove duplicates based on URL
        unique_cases = []
        seen_urls = set()
        
        for case in all_cases:
            if case.get('url') and case['url'] not in seen_urls:
                unique_cases.append(case)
                seen_urls.add(case['url'])
        
        return unique_cases[:limit]
    
    def save_cases_to_file(self, filename: str = None) -> str:
        """
        Save scraped cases to JSON file
        
        Args:
            filename: Output filename (optional)
            
        Returns:
            Path to saved file
        """
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"scraped_cases_{timestamp}.json"
        
        # Ensure we're in the backend directory
        output_path = os.path.join(os.path.dirname(__file__), '..', filename)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.scraped_cases, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved {len(self.scraped_cases)} cases to {output_path}")
        return output_path
    
    def load_cases_from_file(self, filename: str) -> List[Dict[str, Any]]:
        """
        Load cases from JSON file
        
        Args:
            filename: Input filename
            
        Returns:
            List of case dictionaries
        """
        try:
            file_path = os.path.join(os.path.dirname(__file__), '..', filename)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                cases = json.load(f)
            
            logger.info(f"Loaded {len(cases)} cases from {file_path}")
            return cases
            
        except Exception as e:
            logger.error(f"Error loading cases from file: {e}")
            return []

def main():
    """Main function for testing the scraper"""
    scraper = IndianKanoonScraper()
    
    # Test with sample searches
    test_keywords = [
        "breach of contract",
        "fraud",
        "non-payment",
        "software dispute"
    ]
    
    for keyword in test_keywords:
        logger.info(f"Testing scraper with keyword: {keyword}")
        cases = scraper.search_cases_by_keyword(keyword, limit=5)
        
        if cases:
            logger.info(f"Found {len(cases)} cases")
            for case in cases[:2]:  # Show first 2 cases
                logger.info(f"  - {case.get('title', 'No title')}")
        else:
            logger.info("No cases found")
        
        time.sleep(3)  # Be respectful to the server
    
    # Save results
    if scraper.scraped_cases:
        output_file = scraper.save_cases_to_file()
        logger.info(f"Scraped cases saved to: {output_file}")
    else:
        logger.info("No cases were scraped")

if __name__ == "__main__":
    main()
