"""
Pydantic models for all API request/response types.
"""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class AnalysisMode(str, Enum):
    FOUNDER = "founder"
    VC = "vc"


class ClaimCategory(str, Enum):
    TAM = "tam"
    GROWTH = "growth"
    COMPETITOR = "competitor"
    FINANCIAL = "financial"
    TECHNICAL = "technical"
    TEAM = "team"
    GENERAL = "general"


class Verdict(str, Enum):
    VERIFIED = "VERIFIED"
    FALSE = "FALSE"
    EXAGGERATED = "EXAGGERATED"
    UNVERIFIABLE = "UNVERIFIABLE"


class ExtractedClaim(BaseModel):
    """A single claim extracted from the pitch deck."""
    text: str
    page_number: int
    category: ClaimCategory = ClaimCategory.GENERAL
    context: str = ""  # surrounding text for context


class EvidenceSource(BaseModel):
    """A web source used to verify/refute a claim."""
    title: str
    url: str
    snippet: str
    relevance_score: float = 0.0


class ClaimResult(BaseModel):
    """Full verdict for a single claim."""
    claim: str
    page_number: int
    category: ClaimCategory = ClaimCategory.GENERAL
    verdict: Verdict = Verdict.UNVERIFIABLE
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    reasoning: str = ""
    evidence_sources: list[EvidenceSource] = []
    repair_suggestion: Optional[str] = None  # Founder mode only


class DebateMessage(BaseModel):
    """A single message in the adversarial debate."""
    role: str  # "defender" or "prosecutor"
    content: str
    sources: list[EvidenceSource] = []
    claim_ref: str = ""  # which claim this argues about


class FirstImpressionResult(BaseModel):
    """Analysis of the first 3 slides."""
    problem_clarity: float = Field(default=0.0, ge=0.0, le=1.0)
    hook_strength: float = Field(default=0.0, ge=0.0, le=1.0)
    solution_comprehension: float = Field(default=0.0, ge=0.0, le=1.0)
    overall_score: float = Field(default=0.0, ge=0.0, le=1.0)
    feedback: str = ""
    rewrites: list[dict] = []  # [{page, original, rewrite}]


class FinancialStressResult(BaseModel):
    """Financial projection stress test results."""
    projections_found: list[dict] = []
    benchmarks: list[dict] = []
    flags: list[dict] = []  # [{claim, issue, severity, alternative}]
    overall_plausibility: float = Field(default=0.0, ge=0.0, le=1.0)


class CompetitorInfo(BaseModel):
    """Information about a competitor."""
    name: str
    description: str = ""
    funding: str = ""
    trajectory: str = ""
    comparison_points: list[str] = []
    mentioned_in_deck: bool = False


class RedFlagItem(BaseModel):
    """A single red flag with weighted severity."""
    claim: str
    severity: str  # "critical", "major", "minor"
    weight: float = Field(default=0.0, ge=0.0, le=1.0)
    explanation: str = ""
    category: str = ""


class HeatmapEntry(BaseModel):
    """Truth heatmap entry for a single page."""
    page_number: int
    claims: list[ClaimResult] = []
    page_score: float = Field(default=0.0, ge=0.0, le=1.0)  # 1.0 = all verified
    dominant_color: str = "green"  # "green", "amber", "red"


class AnalysisResponse(BaseModel):
    """Full analysis response."""
    session_id: str
    mode: AnalysisMode
    status: str = "processing"  # processing, complete, error
    claims: list[ClaimResult] = []
    first_impression: Optional[FirstImpressionResult] = None
    financial_stress: Optional[FinancialStressResult] = None
    competitors: list[CompetitorInfo] = []
    red_flags: list[RedFlagItem] = []
    debate: list[DebateMessage] = []
    heatmap: list[HeatmapEntry] = []
    overall_trust_score: float = Field(default=0.0, ge=0.0, le=1.0)
    domain_credibility: Optional[dict] = None


class WSMessage(BaseModel):
    """WebSocket message envelope."""
    type: str  # claim_processing, claim_verdict, debate_message, analysis_complete, etc.
    data: dict = {}
