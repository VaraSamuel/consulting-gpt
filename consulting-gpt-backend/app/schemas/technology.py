from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional, Union
from datetime import datetime

class ComparisonAxisBase(BaseModel):
    axis_name: str
    extreme1: str
    extreme2: str
    weight: float = 1.0

class ComparisonAxisCreate(ComparisonAxisBase):
    pass

class ComparisonAxisRead(ComparisonAxisBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    technology_id: int

class RelatedTechnologyBase(BaseModel):
    name: str
    abstract: str
    document_id: str
    type: str
    cluster: Optional[int] = None
    url: Optional[str] = None
    publication_date: Optional[str] = None
    inventors: Optional[str] = None
    assignees: Optional[str] = None
    col: Optional[float] = 0.0

class RelatedTechnologyRead(RelatedTechnologyBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    technology_id: int

class RelatedPaperBase(BaseModel):
    paper_id: str
    title: str
    abstract: Optional[str] = None
    authors: Optional[str] = None
    publication_date: Optional[str] = None
    journal: Optional[str] = None
    url: Optional[str] = None
    citation_count: Optional[int] = 0
    col: Optional[float] = 0.0

class RelatedPaperRead(RelatedPaperBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    technology_id: int

class TechnologyBase(BaseModel):
    name: str
    abstract: str
    num_of_axes: Optional[Union[int, str]] = 5
    number_of_related_patents: Optional[Union[int, str]] = 10
    number_of_related_papers: Optional[Union[int, str]] = 10

    @field_validator('num_of_axes', 'number_of_related_patents', 'number_of_related_papers', mode='before')
    @classmethod
    def convert_to_int(cls, v):
        if isinstance(v, str):
            try:
                return int(v) if v.strip() else 10  # Default to 10 if empty string
            except ValueError:
                return 10  # Default to 10 if invalid string
        return v if v is not None else 10  # Default to 10 if None

class TechnologyCreate(TechnologyBase):
    pass

class TechnologyRead(TechnologyBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    search_keywords: Optional[str] = None
    problem_statement: Optional[str] = None
    market_analysis_summary: Optional[str] = None

class TechnologyDetailRead(TechnologyRead):
    comparison_axes: List[ComparisonAxisRead] = []
    related_technologies: List[RelatedTechnologyRead] = []
    related_papers: List[RelatedPaperRead] = []

class TechnologySearchQuery(BaseModel):
    query: str

class PatentSearchCreate(BaseModel):
    technology_id: int
    search_query: str