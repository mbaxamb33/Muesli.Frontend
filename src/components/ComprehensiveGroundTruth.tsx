// src/components/ComprehensiveGroundTruth.tsx - Advanced Ground Truth with 150 Fields
import React, { useState, useMemo } from "react";
import { Button } from "./components/button";
import { 
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  FilterIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  InfoIcon,
  Building2,
  Users,
  DollarSign,
  Target,
  Zap,
  Shield,
  Settings,
  Brain,
  BarChart3,
  Clock
} from "lucide-react";

// Enhanced Ground Truth Data Structure for 150 fields
interface GroundTruthField {
  id: string;
  fieldNumber: number; // 1-150 from the schema
  fieldName: string;
  category: string;
  tier: 1 | 2 | 3;
  currentValue: string;
  lastUpdated: string;
  updatedBy: string;
  sourceField: string;
  briefId: string;
  briefName: string;
  changeHistory: Array<{
    id: string;
    previousValue: string;
    newValue: string;
    changedAt: string;
    changedBy: string;
    briefId: string;
    briefName: string;
    changeType: 'increase' | 'decrease' | 'neutral';
  }>;
  importance: 'critical' | 'high' | 'medium' | 'low';
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  dataType: 'text' | 'number' | 'percentage' | 'currency' | 'date' | 'rating';
}

// Define the 10 categories with their field ranges and tiers
const GROUND_TRUTH_CATEGORIES = {
  "Company Intelligence": {
    icon: <Building2 className="w-5 h-5" />,
    fields: "1-15",
    description: "Core company data and business fundamentals",
    color: "blue"
  },
  "Strategic Context": {
    icon: <Target className="w-5 h-5" />,
    fields: "16-30", 
    description: "Strategic direction and transformation agenda",
    color: "purple"
  },
  "Buying Committee Intelligence": {
    icon: <Users className="w-5 h-5" />,
    fields: "31-50",
    description: "Decision makers and influencer dynamics",
    color: "green"
  },
  "Current State Assessment": {
    icon: <BarChart3 className="w-5 h-5" />,
    fields: "51-65",
    description: "Existing solutions and pain points",
    color: "orange"
  },
  "Competitive Intelligence": {
    icon: <Zap className="w-5 h-5" />,
    fields: "66-80",
    description: "Competitive landscape and positioning",
    color: "red"
  },
  "Financial & Procurement": {
    icon: <DollarSign className="w-5 h-5" />,
    fields: "81-95",
    description: "Budget, procurement, and financial processes",
    color: "emerald"
  },
  "Project Requirements": {
    icon: <Settings className="w-5 h-5" />,
    fields: "96-110",
    description: "Implementation scope and project planning",
    color: "indigo"
  },
  "Technical & Integration": {
    icon: <Shield className="w-5 h-5" />,
    fields: "111-125",
    description: "Technical architecture and integration needs",
    color: "cyan"
  },
  "Behavioral & Psychological Insights": {
    icon: <Brain className="w-5 h-5" />,
    fields: "126-140",
    description: "Decision-making patterns and preferences",
    color: "pink"
  },
  "Sales Process Tracking": {
    icon: <Clock className="w-5 h-5" />,
    fields: "141-150",
    description: "Opportunity progression and sales metrics",
    color: "yellow"
  }
};

// Mock comprehensive data with full representation across all categories and tiers
const mockComprehensiveGroundTruth: GroundTruthField[] = [
  // Company Intelligence (Fields 1-15) - Mix of Tier 1 & 2
  {
    id: "gt1",
    fieldNumber: 1,
    fieldName: "company_name",
    category: "Company Intelligence",
    tier: 1,
    currentValue: "General Dynamics Corporation",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "company_info.legal_name",
    briefId: "b1", 
    briefName: "Strategic Defense Analysis",
    changeHistory: [],
    importance: "critical",
    updateFrequency: "annually",
    dataType: "text"
  },
  {
    id: "gt2",
    fieldNumber: 2,
    fieldName: "company_overview",
    category: "Company Intelligence",
    tier: 2,
    currentValue: "Aerospace and defense technology corporation with focus on land, marine, aerospace systems and mission-critical technologies",
    lastUpdated: "2025-05-28T14:45:00Z",
    updatedBy: "Market Expansion Study",
    sourceField: "company_info.overview",
    briefId: "b2",
    briefName: "Market Expansion Study",
    changeHistory: [],
    importance: "high",
    updateFrequency: "annually",
    dataType: "text"
  },
  {
    id: "gt3",
    fieldNumber: 3,
    fieldName: "industry_sector",
    category: "Company Intelligence",
    tier: 2,
    currentValue: "Defense & Aerospace (Primary), Government Contracting, Technology Services",
    lastUpdated: "2025-05-15T09:00:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "company_info.industry",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [],
    importance: "high",
    updateFrequency: "annually",
    dataType: "text"
  },
  {
    id: "gt4",
    fieldNumber: 4,
    fieldName: "company_revenue",
    category: "Company Intelligence", 
    tier: 1,
    currentValue: "$40.9 billion USD (2024)",
    lastUpdated: "2025-05-28T14:45:00Z",
    updatedBy: "Market Expansion Study",
    sourceField: "financial_data.annual_revenue",
    briefId: "b2",
    briefName: "Market Expansion Study",
    changeHistory: [
      {
        id: "ch1",
        previousValue: "$39.4 billion USD (2023)",
        newValue: "$40.9 billion USD (2024)",
        changedAt: "2025-05-28T14:45:00Z", 
        changedBy: "Market Expansion Study",
        briefId: "b2",
        briefName: "Market Expansion Study",
        changeType: "increase"
      }
    ],
    importance: "critical",
    updateFrequency: "annually",
    dataType: "currency"
  },
  {
    id: "gt5",
    fieldNumber: 5,
    fieldName: "employee_count",
    category: "Company Intelligence",
    tier: 1,
    currentValue: "106,500 employees globally",
    lastUpdated: "2025-05-20T13:30:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "company_info.workforce",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [
      {
        id: "ch1a",
        previousValue: "104,200 employees globally",
        newValue: "106,500 employees globally",
        changedAt: "2025-05-20T13:30:00Z",
        changedBy: "Technology Assessment",
        briefId: "b3",
        briefName: "Technology Assessment",
        changeType: "increase"
      }
    ],
    importance: "high",
    updateFrequency: "quarterly",
    dataType: "number"
  },
  {
    id: "gt8",
    fieldNumber: 8,
    fieldName: "market_position",
    category: "Company Intelligence",
    tier: 1,
    currentValue: "2nd largest defense contractor globally, 18.5% market share in land systems",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "competitive.market_ranking",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch2",
        previousValue: "2nd largest defense contractor globally, 17.2% market share in land systems",
        newValue: "2nd largest defense contractor globally, 18.5% market share in land systems",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis",
        briefId: "b1",
        briefName: "Strategic Defense Analysis", 
        changeType: "increase"
      }
    ],
    importance: "critical",
    updateFrequency: "quarterly",
    dataType: "text"
  },
  {
    id: "gt10",
    fieldNumber: 10,
    fieldName: "financial_health",
    category: "Company Intelligence",
    tier: 2,
    currentValue: "A- credit rating from S&P, strong balance sheet with $2.8B cash reserves",
    lastUpdated: "2025-05-28T14:45:00Z",
    updatedBy: "Market Expansion Study",
    sourceField: "financial_data.credit_rating",
    briefId: "b2",
    briefName: "Market Expansion Study",
    changeHistory: [],
    importance: "high",
    updateFrequency: "quarterly",
    dataType: "text"
  },

  // Strategic Context (Fields 16-30) - Mix of Tier 1 & 2
  {
    id: "gt17",
    fieldNumber: 17,
    fieldName: "strategic_initiatives",
    category: "Strategic Context",
    tier: 1,
    currentValue: "AI-driven autonomous systems, European market expansion, cybersecurity capabilities enhancement",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "strategy.key_initiatives",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch3",
        previousValue: "AI-driven autonomous systems, European market expansion",
        newValue: "AI-driven autonomous systems, European market expansion, cybersecurity capabilities enhancement",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis",
        briefId: "b1",
        briefName: "Strategic Defense Analysis",
        changeType: "neutral"
      }
    ],
    importance: "critical",
    updateFrequency: "quarterly", 
    dataType: "text"
  },
  {
    id: "gt18",
    fieldNumber: 18,
    fieldName: "quarterly_priorities",
    category: "Strategic Context",
    tier: 1,
    currentValue: "Q2 2025: European partnership establishment, AI system testing, cybersecurity platform launch",
    lastUpdated: "2025-05-28T14:45:00Z",
    updatedBy: "Market Expansion Study",
    sourceField: "strategy.q2_priorities", 
    briefId: "b2",
    briefName: "Market Expansion Study",
    changeHistory: [],
    importance: "high",
    updateFrequency: "quarterly",
    dataType: "text"
  },
  {
    id: "gt19",
    fieldNumber: 19,
    fieldName: "annual_goals",
    category: "Strategic Context",
    tier: 2,
    currentValue: "15% revenue growth, 3 major European partnerships, launch next-gen autonomous platform",
    lastUpdated: "2025-05-15T09:00:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "strategy.annual_targets",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [],
    importance: "high",
    updateFrequency: "annually",
    dataType: "text"
  },
  {
    id: "gt21",
    fieldNumber: 21,
    fieldName: "digital_maturity",
    category: "Strategic Context",
    tier: 2,
    currentValue: "Level 3/5 - Moderate digital adoption, actively investing in AI and automation",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "strategy.digital_score",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [
      {
        id: "ch3a",
        previousValue: "Level 2/5 - Early digital adoption",
        newValue: "Level 3/5 - Moderate digital adoption, actively investing in AI and automation",
        changedAt: "2025-05-27T16:20:00Z",
        changedBy: "Technology Assessment",
        briefId: "b3",
        briefName: "Technology Assessment",
        changeType: "increase"
      }
    ],
    importance: "medium",
    updateFrequency: "quarterly",
    dataType: "rating"
  },

  // Buying Committee Intelligence (Fields 31-50) - Mix of Tier 1 & 2
  {
    id: "gt31",
    fieldNumber: 31,
    fieldName: "economic_buyer_name",
    category: "Buying Committee Intelligence",
    tier: 1,
    currentValue: "Katherine Morrison, CFO",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "buying_committee.economic_buyer",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "critical",
    updateFrequency: "monthly",
    dataType: "text"
  },
  {
    id: "gt33",
    fieldNumber: 33,
    fieldName: "economic_buyer_influence",
    category: "Buying Committee Intelligence",
    tier: 1,
    currentValue: "9/10 - High decision authority, direct budget control",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "buying_committee.influence_level",
    briefId: "b3", 
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "high",
    updateFrequency: "monthly",
    dataType: "rating"
  },
  {
    id: "gt35",
    fieldNumber: 35,
    fieldName: "technical_buyer_name",
    category: "Buying Committee Intelligence",
    tier: 1,
    currentValue: "Dr. James Patterson, CTO & VP Engineering",
    lastUpdated: "2025-05-20T13:30:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "buying_committee.technical_buyer",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "critical",
    updateFrequency: "monthly",
    dataType: "text"
  },
  {
    id: "gt38",
    fieldNumber: 38,
    fieldName: "coach_champion_name",
    category: "Buying Committee Intelligence",
    tier: 1,
    currentValue: "Sarah Williams, Director of Strategic Technology",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "buying_committee.internal_champion",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch3b",
        previousValue: "Michael Chen, Senior Technology Manager",
        newValue: "Sarah Williams, Director of Strategic Technology",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis",
        briefId: "b1",
        briefName: "Strategic Defense Analysis",
        changeType: "neutral"
      }
    ],
    importance: "critical",
    updateFrequency: "monthly",
    dataType: "text"
  },
  {
    id: "gt42",
    fieldNumber: 42,
    fieldName: "committee_dynamics",
    category: "Buying Committee Intelligence",
    tier: 2,
    currentValue: "Consensus-driven decision making, CFO has final approval, CTO has technical veto power",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "buying_committee.dynamics",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "high",
    updateFrequency: "quarterly",
    dataType: "text"
  },

  // Current State Assessment (Fields 51-65) - Tier 2 & 3
  {
    id: "gt51",
    fieldNumber: 51,
    fieldName: "current_solution_provider",
    category: "Current State Assessment",
    tier: 2,
    currentValue: "IBM (primary ERP), Palantir (analytics), legacy in-house systems",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "current_state.vendors",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "high",
    updateFrequency: "quarterly",
    dataType: "text"
  },
  {
    id: "gt52",
    fieldNumber: 52,
    fieldName: "current_solution_satisfaction",
    category: "Current State Assessment",
    tier: 2,
    currentValue: "4/10 - Significant dissatisfaction with current vendor performance",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "current_state.satisfaction_rating",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [
      {
        id: "ch4",
        previousValue: "6/10 - Moderate satisfaction",
        newValue: "4/10 - Significant dissatisfaction with current vendor performance",
        changedAt: "2025-05-27T16:20:00Z",
        changedBy: "Technology Assessment",
        briefId: "b3",
        briefName: "Technology Assessment",
        changeType: "decrease"
      }
    ],
    importance: "high",
    updateFrequency: "monthly",
    dataType: "rating"
  },
  {
    id: "gt55",
    fieldNumber: 55,
    fieldName: "cost_of_status_quo",
    category: "Current State Assessment",
    tier: 2,
    currentValue: "$2.3M annually in operational inefficiencies, 15% productivity loss",
    lastUpdated: "2025-05-28T14:45:00Z",
    updatedBy: "Market Expansion Study",
    sourceField: "current_state.cost_impact",
    briefId: "b2",
    briefName: "Market Expansion Study",
    changeHistory: [],
    importance: "high",
    updateFrequency: "quarterly",
    dataType: "currency"
  },
  {
    id: "gt57",
    fieldNumber: 57,
    fieldName: "contract_end_dates",
    category: "Current State Assessment",
    tier: 3,
    currentValue: "IBM contract expires Dec 2025, Palantir renewal Q1 2026",
    lastUpdated: "2025-05-20T13:30:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "current_state.contract_dates",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "medium",
    updateFrequency: "monthly",
    dataType: "date"
  },

  // Competitive Intelligence (Fields 66-80) - Tier 2 & 3
  {
    id: "gt66",
    fieldNumber: 66,
    fieldName: "competitors_in_evaluation",
    category: "Competitive Intelligence",
    tier: 2,
    currentValue: "Microsoft (preferred), Salesforce, Oracle, SAP",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "competitive.evaluation_list",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch4a",
        previousValue: "Microsoft (preferred), Salesforce, Oracle",
        newValue: "Microsoft (preferred), Salesforce, Oracle, SAP",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis",
        briefId: "b1",
        briefName: "Strategic Defense Analysis",
        changeType: "neutral"
      }
    ],
    importance: "high",
    updateFrequency: "weekly",
    dataType: "text"
  },
  {
    id: "gt67",
    fieldNumber: 67,
    fieldName: "preferred_vendor_bias",
    category: "Competitive Intelligence",
    tier: 2,
    currentValue: "Strong Microsoft preference due to existing Azure infrastructure",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "competitive.vendor_preference",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "critical",
    updateFrequency: "monthly",
    dataType: "text"
  },
  {
    id: "gt71",
    fieldNumber: 71,
    fieldName: "pricing_expectations",
    category: "Competitive Intelligence",
    tier: 2,
    currentValue: "$8-12M range, prefers subscription model over perpetual licenses",
    lastUpdated: "2025-05-28T14:45:00Z",
    updatedBy: "Market Expansion Study",
    sourceField: "competitive.price_range",
    briefId: "b2",
    briefName: "Market Expansion Study",
    changeHistory: [],
    importance: "critical",
    updateFrequency: "monthly",
    dataType: "currency"
  },
  {
    id: "gt80",
    fieldNumber: 80,
    fieldName: "decision_timeline",
    category: "Competitive Intelligence",
    tier: 1,
    currentValue: "Final decision by August 15, 2025, implementation start Q4 2025",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "competitive.timeline",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch4b",
        previousValue: "Final decision by September 30, 2025",
        newValue: "Final decision by August 15, 2025, implementation start Q4 2025",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis",
        briefId: "b1",
        briefName: "Strategic Defense Analysis",
        changeType: "increase"
      }
    ],
    importance: "critical",
    updateFrequency: "weekly",
    dataType: "date"
  },

  // Financial & Procurement (Fields 81-95) - Tier 1 & 2
  {
    id: "gt81",
    fieldNumber: 81,
    fieldName: "total_available_budget",
    category: "Financial & Procurement",
    tier: 1,
    currentValue: "$15.7 million allocated for technology modernization",
    lastUpdated: "2025-05-28T14:45:00Z",
    updatedBy: "Market Expansion Study",
    sourceField: "budget.total_allocation",
    briefId: "b2",
    briefName: "Market Expansion Study", 
    changeHistory: [],
    importance: "critical",
    updateFrequency: "annually",
    dataType: "currency"
  },
  {
    id: "gt84",
    fieldNumber: 84,
    fieldName: "procurement_process",
    category: "Financial & Procurement",
    tier: 2,
    currentValue: "Formal RFP required for >$5M, 90-day evaluation cycle, legal review mandatory",
    lastUpdated: "2025-05-20T13:30:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "procurement.process_requirements",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "high",
    updateFrequency: "annually",
    dataType: "text"
  },
  {
    id: "gt90",
    fieldNumber: 90,
    fieldName: "roi_calculation_method",
    category: "Financial & Procurement",
    tier: 2,
    currentValue: "3-year NPV model, requires 25% IRR minimum, payback within 18 months",
    lastUpdated: "2025-05-28T14:45:00Z",
    updatedBy: "Market Expansion Study",
    sourceField: "budget.roi_requirements",
    briefId: "b2",
    briefName: "Market Expansion Study",
    changeHistory: [],
    importance: "high",
    updateFrequency: "annually",
    dataType: "text"
  },

  // Project Requirements (Fields 96-110) - Tier 2 & 3
  {
    id: "gt96",
    fieldNumber: 96,
    fieldName: "project_scope",
    category: "Project Requirements",
    tier: 2,
    currentValue: "Full ERP replacement across 12 facilities, 8,500 users, integration with 23 systems",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "project.scope_definition",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "high",
    updateFrequency: "monthly",
    dataType: "text"
  },
  {
    id: "gt98",
    fieldNumber: 98,
    fieldName: "implementation_timeline",
    category: "Project Requirements",
    tier: 2,
    currentValue: "18-month phased rollout: Phase 1 (Q4 2025), Phase 2 (Q2 2026), Phase 3 (Q4 2026)",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "project.timeline",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch4c",
        previousValue: "24-month implementation timeline",
        newValue: "18-month phased rollout: Phase 1 (Q4 2025), Phase 2 (Q2 2026), Phase 3 (Q4 2026)",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis",
        briefId: "b1",
        briefName: "Strategic Defense Analysis",
        changeType: "increase"
      }
    ],
    importance: "high",
    updateFrequency: "monthly",
    dataType: "text"
  },
  {
    id: "gt103",
    fieldNumber: 103,
    fieldName: "training_requirements",
    category: "Project Requirements",
    tier: 3,
    currentValue: "Comprehensive training for 8,500 users, certification program for 150 power users",
    lastUpdated: "2025-05-20T13:30:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "project.training_needs",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "medium",
    updateFrequency: "monthly",
    dataType: "text"
  },

  // Technical & Integration (Fields 111-125) - Tier 2 & 3
  {
    id: "gt111",
    fieldNumber: 111,
    fieldName: "technical_architecture",
    category: "Technical & Integration",
    tier: 2,
    currentValue: "Azure cloud-first, microservices architecture, API-driven integrations",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "technical.architecture",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "high",
    updateFrequency: "quarterly",
    dataType: "text"
  },
  {
    id: "gt112",
    fieldNumber: 112,
    fieldName: "security_requirements",
    category: "Technical & Integration",
    tier: 2,
    currentValue: "FedRAMP High authorization required, NIST 800-53 compliance, multi-factor authentication",
    lastUpdated: "2025-05-20T13:30:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "technical.security_standards",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "critical",
    updateFrequency: "annually",
    dataType: "text"
  },
  {
    id: "gt114",
    fieldNumber: 114,
    fieldName: "integration_points",
    category: "Technical & Integration",
    tier: 3,
    currentValue: "23 systems: SAP ECC, Salesforce, Active Directory, Oracle DB, 19 legacy applications",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "technical.integration_list",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "high",
    updateFrequency: "monthly",
    dataType: "text"
  },
  {
    id: "gt117",
    fieldNumber: 117,
    fieldName: "scalability_requirements",
    category: "Technical & Integration",
    tier: 3,
    currentValue: "Support 15,000 users by 2027, 500% data growth capacity, global deployment ready",
    lastUpdated: "2025-05-28T14:45:00Z",
    updatedBy: "Market Expansion Study",
    sourceField: "technical.scalability",
    briefId: "b2",
    briefName: "Market Expansion Study",
    changeHistory: [],
    importance: "medium",
    updateFrequency: "quarterly",
    dataType: "text"
  },

  // Behavioral & Psychological Insights (Fields 126-140) - Tier 2 & 3
  {
    id: "gt126",
    fieldNumber: 126,
    fieldName: "decision_making_style",
    category: "Behavioral & Psychological Insights",
    tier: 2,
    currentValue: "Consensus-driven with CFO final approval, risk-averse, data-driven analysis required",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "behavioral.decision_style",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [],
    importance: "high",
    updateFrequency: "quarterly",
    dataType: "text"
  },
  {
    id: "gt127",
    fieldNumber: 127,
    fieldName: "risk_aversion_level",
    category: "Behavioral & Psychological Insights",
    tier: 2,
    currentValue: "8/10 - High risk aversion, prefers proven solutions and established vendors",
    lastUpdated: "2025-05-27T16:20:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "behavioral.risk_tolerance",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [
      {
        id: "ch4d",
        previousValue: "7/10 - Moderate to high risk aversion",
        newValue: "8/10 - High risk aversion, prefers proven solutions and established vendors",
        changedAt: "2025-05-27T16:20:00Z",
        changedBy: "Technology Assessment",
        briefId: "b3",
        briefName: "Technology Assessment",
        changeType: "increase"
      }
    ],
    importance: "high",
    updateFrequency: "quarterly",
    dataType: "rating"
  },
  {
    id: "gt133",
    fieldNumber: 133,
    fieldName: "trust_building_factors",
    category: "Behavioral & Psychological Insights",
    tier: 3,
    currentValue: "Government references, security certifications, proven track record in defense sector",
    lastUpdated: "2025-05-20T13:30:00Z",
    updatedBy: "Technology Assessment",
    sourceField: "behavioral.trust_factors",
    briefId: "b3",
    briefName: "Technology Assessment",
    changeHistory: [],
    importance: "medium",
    updateFrequency: "quarterly",
    dataType: "text"
  },
  {
    id: "gt139",
    fieldNumber: 139,
    fieldName: "presentation_style_preferences",
    category: "Behavioral & Psychological Insights",
    tier: 3,
    currentValue: "Executive summary first, detailed technical appendix, ROI focus, 30-min max presentations",
    lastUpdated: "2025-05-28T14:45:00Z",
    updatedBy: "Market Expansion Study",
    sourceField: "behavioral.presentation_style",
    briefId: "b2",
    briefName: "Market Expansion Study",
    changeHistory: [],
    importance: "medium",
    updateFrequency: "monthly",
    dataType: "text"
  },

  // Sales Process Tracking (Fields 141-150) - Tier 1
  {
    id: "gt141",
    fieldNumber: 141,
    fieldName: "lead_source",
    category: "Sales Process Tracking",
    tier: 1,
    currentValue: "Inbound inquiry from strategic partnership referral (Lockheed Martin)",
    lastUpdated: "2025-05-15T09:00:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "sales.lead_origin",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [],
    importance: "medium",
    updateFrequency: "daily",
    dataType: "text"
  },
  {
    id: "gt142",
    fieldNumber: 142,
    fieldName: "opportunity_stage",
    category: "Sales Process Tracking",
    tier: 1,
    currentValue: "Stage 5: Proposal/Negotiation - Technical evaluation complete, commercial discussions active",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "sales.current_stage",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch5a",
        previousValue: "Stage 4: Evaluation - Technical requirements gathering",
        newValue: "Stage 5: Proposal/Negotiation - Technical evaluation complete, commercial discussions active",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis",
        briefId: "b1",
        briefName: "Strategic Defense Analysis",
        changeType: "increase"
      }
    ],
    importance: "critical",
    updateFrequency: "weekly",
    dataType: "text"
  },
  {
    id: "gt143",
    fieldNumber: 143,
    fieldName: "probability_percentage",
    category: "Sales Process Tracking",
    tier: 1,
    currentValue: "75% - Strong indicators, moving to final evaluation",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "sales.win_probability",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch5",
        previousValue: "65% - Moderate confidence",
        newValue: "75% - Strong indicators, moving to final evaluation",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis", 
        briefId: "b1",
        briefName: "Strategic Defense Analysis",
        changeType: "increase"
      }
    ],
    importance: "critical",
    updateFrequency: "weekly",
    dataType: "percentage"
  },
  {
    id: "gt144",
    fieldNumber: 144,
    fieldName: "weighted_value",
    category: "Sales Process Tracking",
    tier: 1,
    currentValue: "$11.8 million (75% of $15.7M total opportunity)",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "sales.weighted_deal_value",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch5b",
        previousValue: "$10.2 million (65% of $15.7M total opportunity)",
        newValue: "$11.8 million (75% of $15.7M total opportunity)",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis",
        briefId: "b1",
        briefName: "Strategic Defense Analysis",
        changeType: "increase"
      }
    ],
    importance: "critical",
    updateFrequency: "weekly",
    dataType: "currency"
  },
  {
    id: "gt146",
    fieldNumber: 146,
    fieldName: "key_milestones",
    category: "Sales Process Tracking",
    tier: 1,
    currentValue: "RFP response due June 30, final presentation July 15, decision August 15",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "sales.critical_dates",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [],
    importance: "critical",
    updateFrequency: "weekly",
    dataType: "date"
  },
  {
    id: "gt147",
    fieldNumber: 147,
    fieldName: "sales_velocity",
    category: "Sales Process Tracking",
    tier: 1,
    currentValue: "Accelerating - 2 stages advanced in 6 weeks, above average pace for enterprise deals",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "sales.velocity_assessment",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch5c",
        previousValue: "Steady progress - normal enterprise sales cycle pace",
        newValue: "Accelerating - 2 stages advanced in 6 weeks, above average pace for enterprise deals",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis",
        briefId: "b1",
        briefName: "Strategic Defense Analysis",
        changeType: "increase"
      }
    ],
    importance: "high",
    updateFrequency: "weekly",
    dataType: "text"
  },
  {
    id: "gt149",
    fieldNumber: 149,
    fieldName: "competitive_position",
    category: "Sales Process Tracking",
    tier: 1,
    currentValue: "#2 position behind Microsoft, ahead of Oracle and SAP",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "sales.competitive_ranking",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [
      {
        id: "ch5d",
        previousValue: "#3 position behind Microsoft and Oracle",
        newValue: "#2 position behind Microsoft, ahead of Oracle and SAP",
        changedAt: "2025-05-29T10:30:00Z",
        changedBy: "Strategic Defense Analysis",
        briefId: "b1",
        briefName: "Strategic Defense Analysis",
        changeType: "increase"
      }
    ],
    importance: "critical",
    updateFrequency: "weekly",
    dataType: "text"
  },
  {
    id: "gt150",
    fieldNumber: 150,
    fieldName: "win_probability_factors",
    category: "Sales Process Tracking",
    tier: 1,
    currentValue: "Strengths: Government experience, security compliance, technical fit. Risks: Price premium, Microsoft preference",
    lastUpdated: "2025-05-29T10:30:00Z",
    updatedBy: "Strategic Defense Analysis",
    sourceField: "sales.win_loss_factors",
    briefId: "b1",
    briefName: "Strategic Defense Analysis",
    changeHistory: [],
    importance: "high",
    updateFrequency: "weekly",
    dataType: "text"
  }
];

interface ComprehensiveGroundTruthProps {
  groundTruthData: GroundTruthField[];
  isDark: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ComprehensiveGroundTruth: React.FC<ComprehensiveGroundTruthProps> = ({
  groundTruthData,
  isDark,
  isExpanded,
  onToggle
}) => {
  // Use mock data if no data is provided or if empty array is passed
  const dataToUse = (!groundTruthData || groundTruthData.length === 0) ? mockComprehensiveGroundTruth : groundTruthData;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'fieldNumber' | 'lastUpdated' | 'importance'>('fieldNumber');

  // Filter and sort ground truth data
  const filteredAndSortedData = useMemo(() => {
    let filtered = dataToUse.filter(field => {
      const matchesCategory = selectedCategory === "all" || field.category === selectedCategory;
      const matchesTier = selectedTier === "all" || field.tier.toString() === selectedTier;
      const matchesSearch = 
        field.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.currentValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesTier && matchesSearch;
    });

    // Sort the filtered data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'fieldNumber':
          return a.fieldNumber - b.fieldNumber;
        case 'lastUpdated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'importance':
          const importanceOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return importanceOrder[b.importance] - importanceOrder[a.importance];
        default:
          return 0;
      }
    });

    return filtered;
  }, [dataToUse, selectedCategory, selectedTier, searchTerm, sortBy]);

  // Group data by category
  const groupedData = useMemo(() => {
    const groups: Record<string, GroundTruthField[]> = {};
    filteredAndSortedData.forEach(field => {
      if (!groups[field.category]) {
        groups[field.category] = [];
      }
      groups[field.category].push(field);
    });
    return groups;
  }, [filteredAndSortedData]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const tier1Fields = dataToUse.filter(f => f.tier === 1);
    const recentUpdates = dataToUse.filter(f => 
      new Date(f.lastUpdated).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    const fieldsWithChanges = dataToUse.filter(f => f.changeHistory.length > 0);
    
    return {
      totalFields: dataToUse.length,
      tier1Count: tier1Fields.length,
      recentUpdates: recentUpdates.length,
      fieldsWithChanges: fieldsWithChanges.length
    };
  }, [dataToUse]);

  const toggleCategoryExpansion = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleFieldExpansion = (fieldId: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldId)) {
      newExpanded.delete(fieldId);
    } else {
      newExpanded.add(fieldId);
    }
    setExpandedFields(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const categoryInfo = Object.entries(GROUND_TRUTH_CATEGORIES).find(([name]) => name === category);
    return categoryInfo ? categoryInfo[1].color : 'gray';
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return isDark ? 'text-red-400' : 'text-red-600';
      case 'high': return isDark ? 'text-orange-400' : 'text-orange-600';
      case 'medium': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'low': return isDark ? 'text-gray-400' : 'text-gray-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <TrendingUpIcon className="w-3 h-3 text-green-500" />;
      case 'decrease': return <TrendingDownIcon className="w-3 h-3 text-red-500" />;
      default: return <MinusIcon className="w-3 h-3 text-gray-500" />;
    }
  };

  const getTierBadge = (tier: number) => {
    const tierStyles = {
      1: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
      2: isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800', 
      3: isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-200 text-gray-600'
    };
    
    const tierLabels = { 1: 'Critical', 2: 'Important', 3: 'Detailed' };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tierStyles[tier as keyof typeof tierStyles]}`}>
        Tier {tier} - {tierLabels[tier as keyof typeof tierLabels]}
      </span>
    );
  };

  return (
    <div className={`rounded-lg border mb-6 ${
      isDark ? 'bg-[#17162e] border-[#2e2c50]' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div 
        className={`p-6 cursor-pointer transition-colors duration-200 ${
          isDark ? 'hover:bg-[#201e3d]' : 'hover:bg-gray-50'
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-[#201e3d]' : 'bg-blue-100'
            }`}>
              <InfoIcon className={`w-5 h-5 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Comprehensive Ground Truth Intelligence
              </h2>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Complete sales intelligence database with change tracking across all 150 fields
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Summary Stats */}
            <div className="flex items-center space-x-4 text-xs">
              <div className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="font-bold text-lg">{summaryStats.totalFields}</div>
                <div>Total Fields</div>
              </div>
              <div className={`text-center ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                <div className="font-bold text-lg">{summaryStats.tier1Count}</div>
                <div>Critical</div>
              </div>
              <div className={`text-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                <div className="font-bold text-lg">{summaryStats.recentUpdates}</div>
                <div>Recent Updates</div>
              </div>
              <div className={`text-center ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                <div className="font-bold text-lg">{summaryStats.fieldsWithChanges}</div>
                <div>With Changes</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {isExpanded ? 'Collapse' : 'Expand'}
              </span>
              {isExpanded ? (
                <ChevronDownIcon className={`w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
              ) : (
                <ChevronRightIcon className={`w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className={`border-t px-6 pb-6 ${
          isDark ? 'border-[#2e2c50]' : 'border-gray-200'
        }`}>
          {/* Advanced Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 pt-6 gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className={`relative ${isDark ? "text-white" : "text-gray-800"}`}>
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search across all 150 fields..."
                  className={`pl-10 pr-4 py-2 rounded-lg text-sm w-64 ${
                    isDark ? "bg-[#201e3d] text-white" : "bg-gray-50 text-gray-800"
                  } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  isDark ? "bg-[#201e3d] text-white" : "bg-gray-50 text-gray-800"
                } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
              >
                <option value="all">All Categories</option>
                {Object.keys(GROUND_TRUTH_CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Tier Filter */}
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  isDark ? "bg-[#201e3d] text-white" : "bg-gray-50 text-gray-800"
                } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
              >
                <option value="all">All Tiers</option>
                <option value="1">Tier 1 - Critical</option>
                <option value="2">Tier 2 - Important</option>
                <option value="3">Tier 3 - Detailed</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <FilterIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  isDark ? "bg-[#201e3d] text-white" : "bg-gray-50 text-gray-800"
                } border ${isDark ? "border-[#2e2c50]" : "border-gray-200"}`}
              >
                <option value="fieldNumber">Sort by Field Number</option>
                <option value="lastUpdated">Sort by Last Updated</option>
                <option value="importance">Sort by Importance</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className={`mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredAndSortedData.length} of {dataToUse.length} fields
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
            {selectedTier !== "all" && ` (Tier ${selectedTier})`}
          </div>

          {/* Ground Truth Content */}
          {Object.keys(groupedData).length === 0 ? (
            <div className={`text-center py-8 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              <InfoIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No fields match your criteria</p>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedData).map(([category, fields]) => {
                const categoryInfo = GROUND_TRUTH_CATEGORIES[category as keyof typeof GROUND_TRUTH_CATEGORIES];
                const isExpanded = expandedCategories.has(category);
                
                return (
                  <div key={category}>
                    {/* Category Header */}
                    <div 
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                        isDark ? 'bg-[#201e3d] hover:bg-[#2a2847]' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleCategoryExpansion(category)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${categoryInfo.color}-100`}>
                          {categoryInfo.icon}
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {category}
                          </h3>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {categoryInfo.description} • Fields {categoryInfo.fields}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          isDark ? 'bg-[#17162e] text-gray-300' : 'bg-white text-gray-600'
                        }`}>
                          {fields.length} fields
                        </span>
                        {isExpanded ? (
                          <ChevronDownIcon className="w-5 h-5" />
                        ) : (
                          <ChevronRightIcon className="w-5 h-5" />
                        )}
                      </div>
                    </div>

                    {/* Category Fields */}
                    {isExpanded && (
                      <div className="mt-4 space-y-3">
                        {fields.map((field) => {
                          const isFieldExpanded = expandedFields.has(field.id);
                          
                          return (
                            <div key={field.id} className={`border rounded-lg ${
                              isDark ? 'border-[#2e2c50] bg-[#17162e]' : 'border-gray-200 bg-white'
                            }`}>
                              {/* Field Header */}
                              <div className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className={`text-xs px-2 py-1 rounded font-mono ${
                                        isDark ? 'bg-[#201e3d] text-gray-300' : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        #{field.fieldNumber}
                                      </span>
                                      {getTierBadge(field.tier)}
                                      <span className={`text-xs px-2 py-1 rounded ${getImportanceColor(field.importance)}`}>
                                        {field.importance.toUpperCase()}
                                      </span>
                                    </div>
                                    <h4 className={`font-medium mb-1 ${
                                      isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {field.fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </h4>
                                    <p className={`${
                                      isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                      {field.currentValue}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    {field.changeHistory.length > 0 && (
                                      <div className="flex items-center space-x-1">
                                        {getChangeIcon(field.changeHistory[field.changeHistory.length - 1]?.changeType || 'neutral')}
                                        <span className={`text-xs ${
                                          isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                          {field.changeHistory.length} changes
                                        </span>
                                      </div>
                                    )}
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleFieldExpansion(field.id)}
                                      className={`${
                                        isDark 
                                        ? "text-gray-400 hover:bg-[#201e3d] hover:text-gray-300" 
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                      }`}
                                    >
                                      {isFieldExpanded ? (
                                        <ChevronDownIcon className="w-4 h-4" />
                                      ) : (
                                        <ChevronRightIcon className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {/* Field Metadata */}
                                <div className="flex flex-wrap items-center gap-4 text-xs">
                                  <div className={`flex items-center space-x-1 ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    <Clock className="w-3 h-3" />
                                    <span>Updated {formatDate(field.lastUpdated)}</span>
                                  </div>
                                  <div className={`flex items-center space-x-1 ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    <span>Source: {field.updatedBy}</span>
                                  </div>
                                  <div className={`flex items-center space-x-1 ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    <span>Type: {field.dataType}</span>
                                  </div>
                                  <div className={`flex items-center space-x-1 ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    <span>Update Frequency: {field.updateFrequency}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Expanded Field Details */}
                              {isFieldExpanded && (
                                <div className={`border-t px-4 py-4 ${
                                  isDark ? 'border-[#2e2c50] bg-[#201e3d]' : 'border-gray-200 bg-gray-50'
                                }`}>
                                  {/* Technical Details */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <h5 className={`text-sm font-medium mb-2 ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                      }`}>
                                        Technical Details
                                      </h5>
                                      <div className="space-y-1 text-xs">
                                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                          <span className="font-medium">Field ID:</span> {field.sourceField}
                                        </div>
                                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                          <span className="font-medium">Data Type:</span> {field.dataType}
                                        </div>
                                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                          <span className="font-medium">Update Pattern:</span> {field.updateFrequency}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h5 className={`text-sm font-medium mb-2 ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                      }`}>
                                        Classification
                                      </h5>
                                      <div className="space-y-1 text-xs">
                                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                          <span className="font-medium">Tier:</span> {field.tier} ({field.tier === 1 ? 'Critical' : field.tier === 2 ? 'Important' : 'Detailed'})
                                        </div>
                                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                          <span className="font-medium">Importance:</span> {field.importance}
                                        </div>
                                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                          <span className="font-medium">Category:</span> {field.category}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Change History */}
                                  {field.changeHistory.length > 0 && (
                                    <div>
                                      <h5 className={`text-sm font-medium mb-3 ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                      }`}>
                                        Change History ({field.changeHistory.length})
                                      </h5>
                                      <div className="space-y-3 max-h-40 overflow-y-auto">
                                        {field.changeHistory.map((change) => (
                                          <div key={change.id} className={`p-3 rounded border ${
                                            isDark ? 'border-[#2e2c50] bg-[#17162e]' : 'border-gray-200 bg-white'
                                          }`}>
                                            <div className="flex items-center justify-between mb-2">
                                              <div className={`text-xs ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                              }`}>
                                                {formatDate(change.changedAt)} • {change.changedBy}
                                              </div>
                                              <div className="flex items-center space-x-1">
                                                {getChangeIcon(change.changeType)}
                                                <span className={`text-xs ${
                                                  change.changeType === 'increase' ? 'text-green-500' :
                                                  change.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'
                                                }`}>
                                                  {change.changeType}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="space-y-1">
                                              <div className={`text-sm p-2 rounded ${
                                                isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700'
                                              }`}>
                                                <span className="font-medium">Previous: </span>
                                                {change.previousValue}
                                              </div>
                                              <div className={`text-sm p-2 rounded ${
                                                isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
                                              }`}>
                                                <span className="font-medium">Updated: </span>
                                                {change.newValue}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* No Change History */}
                                  {field.changeHistory.length === 0 && (
                                    <div className={`text-center py-4 ${
                                      isDark ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                      <p className="text-sm">No change history available</p>
                                      <p className="text-xs">This field was set once and hasn't been updated</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Actions */}
          <div className={`mt-6 pt-4 border-t ${
            isDark ? 'border-[#2e2c50]' : 'border-gray-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedCategories(new Set(Object.keys(GROUND_TRUTH_CATEGORIES)))}
                  className={`${
                    isDark 
                    ? "border-[#2e2c50] text-white hover:bg-[#201e3d]" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Expand All Categories
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedCategories(new Set())}
                  className={`${
                    isDark 
                    ? "border-[#2e2c50] text-white hover:bg-[#201e3d]" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Collapse All Categories
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline" 
                  size="sm"
                  className={`${
                    isDark 
                    ? "border-[#2e2c50] text-white hover:bg-[#201e3d]" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Export Ground Truth
                </Button>
                <Button
                  size="sm"
                  className={`${
                    isDark ? "bg-[#14ea29] hover:bg-[#14ea29]/90 text-black" : "bg-blue-700 hover:bg-blue-800 text-white"
                  }`}
                >
                  Update Field
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};