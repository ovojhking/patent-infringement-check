import { useSelector } from "react-redux";
import { analysis } from "../features/analysis";
import { Analysis } from "../interfaces/analysis";
import { Card, Badge, Button } from "react-bootstrap";
import moment from "moment";
import {InfringingProduct} from '../interfaces/analysis';

const Result = () => {
  const analysisResult: Analysis = useSelector(analysis);
  const { company_name: companyName, patent_id: patentId, analysis_date: date, top_infringing_products: topInfringingProducts, overall_risk_assessment: overallRiskAssessment  } = analysisResult.data || {};

  const save = () => {
    localStorage.setItem("analysis", JSON.stringify(analysisResult));

    alert("Analysis saved successfully!");
  };

  return (
    <div className="w-[100%] min-h-[100vh]">
      <div className="max-w-[768px] m-auto w-[100%]">
        <div className="flex justify-between items-center">

          <h1 className="m-0 text-[70px]">{companyName}</h1>
            
          <Button
            variant="outline-primary"          
            onClick={save}
          >
            Collect
          </Button>
        </div>

        <div className="flex mt-[10px]">
          <span className="font-light text-[12px]">
            Date:{" "}{moment(date).format("MM-DD-YYYY")}
          </span>

          <span className="font-light text-[12px] ml-[15px]">Patent ID:{" "} {patentId}</span>
        </div>

        {topInfringingProducts?.length ? (
          <>
            <h3 style={{ width: "100%" }} className="text-[20px] mb-[30px] mt-[30px]">
              Top 2 Infringing Products
            </h3>

            <div
              className="flex justify-start align-center flex-wrap"
            >
              {topInfringingProducts.map((product: InfringingProduct, index) => (
                <Card border="dark" bg="dark" className="text-white lg:w-[286px] md:w-[100%] m-[20px]" key={index}>
                  <Card.Header className="flex justify-between align-center">
                    <div>{product.product_name}</div>
          
                    {product.infringement_likelihood === "High" && (
                      <Badge pill bg="danger">High Risk</Badge>
                    )}
                    {product.infringement_likelihood === "Moderate" && (
                      <Badge pill bg="warning" style={{ color: "black" }}>
                        Mid Risk
                      </Badge>
                    )}
                    {product.infringement_likelihood === "Low" && (
                      <Badge pill bg="secondary" style={{ color: "#fff" }}>
                        Low Risk
                      </Badge>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="mb-4 text-[12px]">{product.explanation}</Card.Text>
                    <Card.Subtitle className="mb-2 text-[12px] font-medium">
                      Relevant Claims
                    </Card.Subtitle>
                    <Card.Text className="text-[12px]">
                      {product.relevant_claims.join(", ")}
                    </Card.Text>

                    <Card.Subtitle className="mb-2 text-[12px] font-medium">
                      Specific Features
                    </Card.Subtitle>
                    {product.specific_features.map((feature, index) => (
                      <Card.Text className="text-[12px]" key={index}>
                        {feature}
                      </Card.Text>
                    ))}
                  </Card.Body>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
       
    </div>
  );
};

export default Result;
