/**
 * Interface for the analysis result
 */
export interface Analysis {
  status: string;
  data?: AnalysisData;
  message?: string;
};

export interface AnalysisData {
  patent_id: string;
  company_name: string;
  analysis_date: string;
  top_infringing_products: InfringingProduct[];
  overall_risk_assessment: string;
}

/**
 * Interface for each infringing product
 */
export interface InfringingProduct {
  product_name: string;
  infringement_likelihood: "High" | "Moderate" | "Low";
  relevant_claims: string[];
  explanation: string;
  specific_features: string[];
}