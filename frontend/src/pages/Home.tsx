import { useEffect, useState } from "react";
import { FormControl, Button, Form, Spinner } from "react-bootstrap";
import { Analysis } from "../interfaces/analysis";
import { useDispatch } from "react-redux";
import { update } from "../features/analysis";
import { useNavigate } from "react-router-dom";



const Home = () => {
  const [patentId, setPatentId] = useState("");

  const [company, setCompany] = useState("");

  const [loading, setLoading] = useState(false);

  const [disableViewLastAnalysis, setDisableViewLastAnalysis] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const analysis = localStorage.getItem("analysis");

    if (analysis) {
      setDisableViewLastAnalysis(false);
    } else {
      setDisableViewLastAnalysis(true);
    }
  }, []);


  const search = async (): Promise<void> => {
    if(loading) return;

    setLoading(true);

    const analysis: Analysis = await fetch(`http://localhost:2000/api/check-infringement`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          patentID: patentId,
          companyName: company,
      }),
    }).then((res) => res.json());

    if(analysis?.status === 'error') {
      alert(analysis.message);
      setLoading(false);
      return;
    }

    dispatch(update(analysis));
    setLoading(false);
    navigate("/result");
  };

  const handleViewLastAnalysis = () => {
    const analysis = localStorage.getItem("analysis");

    if (analysis) {
      dispatch(update(JSON.parse(analysis)));
      navigate("/result");
    } else {
      alert("No analysis found. Please perform a new search.");
    }
  };

  return (
    <div className="max-w-[768px] m-auto">
      <h1 className="text-[40px] pt-[20px]">{'Patent Infringement Check'}</h1>
      <div className="mt-[50px]">
        <Form>
          <Form.Group className="mb-3" controlId="ControlInput1">
            <Form.Label style={{ color: "#fff" }}>Patent ID</Form.Label>
            <FormControl
              type="text"
              value={patentId}
              onChange={(e) => setPatentId(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="ControlTextarea1">
            <Form.Label style={{ color: "#fff" }}>Company Name</Form.Label>
            <FormControl
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Form.Group>
          <div className="flex justify-between items-end">
            {
              disableViewLastAnalysis ? (
                <div className="text-gray-400 cursor-not-allowed">View last record</div>
              ) : (
                <div onClick={handleViewLastAnalysis} className="cursor-pointer underline underline-offset-1 text-primary">View last record</div>
              )
            }

            <Button variant="primary" onClick={() => search()} disabled={!patentId.length || !company.length}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Loading...</span>
              </>
            ) : (
              'Search'
            )}
            </Button>
          </div>
          
        </Form>
      </div>
    </div>
  );
};

export default Home;
