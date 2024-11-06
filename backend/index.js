const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require("fs");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 中介軟體
app.use(cors());
app.use(express.json());

async function getPatentData(patentId) {
    const patentsData = JSON.parse(fs.readFileSync("sources/patents.json"));
    const mostProbablePatentId = getMostProbablePatentId(patentId, patentsData);
    return patentsData.find((patent) => patent.publication_number === mostProbablePatentId);
}

function getMostProbablePatentId(patentId, patentsData) {
  const patentIds = patentsData.map((patent) => patent.publication_number);
  const patentIdWithoutHyphen = patentId.replace(/-/g, "").toLowerCase();
  const overlap = patentIds.map((id) => {
    const idWithoutHyphen = id.replace(/-/g, "").toLowerCase();
    const common = new Set(
      [...patentIdWithoutHyphen].filter((x) => idWithoutHyphen.includes(x))
    );
    return { id, common: common.size };
  });

  overlap.sort((a, b) => b.common - a.common);

  return overlap[0].id;
};

async function getCompanyProducts(companyName) {
    const productsData = JSON.parse(fs.readFileSync("sources/company_products.json"));
    const mostProbableCompanyName = getMostProbableCompanyName(companyName, productsData);
    const company = productsData.companies.find(
        (comp) => comp.name.toLowerCase() === mostProbableCompanyName.toLowerCase()
    );
    return company ? company.products : null;
}

function getMostProbableCompanyName(companyName, productsData) {
  const companyNames = productsData.companies.map(
    (companyProduct) => companyProduct.name
  );

  const companyNameLowercase = companyName.toLowerCase();

  const overlap = companyNames.map((name) => {
    const nameLowercase = name.toLowerCase();
    const common = new Set(
      [...companyNameLowercase].filter((x) => nameLowercase.includes(x))
    );
    return { name, common: common.size };
  });

  overlap.sort((a, b) => b.common - a.common);

  return overlap[0].name;
};

async function checkInfringementWithOpenAI(patentID, companyName) {
    const patentData = await getPatentData(patentID);
    if (!patentData) {
      console.log("Patent ID not found.");
      return { status: "error", message: `Patent with ID ${patentID} not found.` };
    }
  
    const products = await getCompanyProducts(companyName);
    if (!products) {
      console.log("Company name not found.");
      return { status: "error", message: `Company with name ${companyName} not found.` };
    }
  
    // 準備 Prompt
    const prompt = `
      Patent ID: ${patentID}
      Company Name: ${companyName}
      Patent: ${JSON.stringify(patentData)}
      Products: ${JSON.stringify(products)}
  
      Based on the following input, generate a patent infringement analysis report. Please return the result in JSON format and include the following fields: the top two potentially infringing products, each product’s infringement risk assessment, relevant patent claims, an explanation of the infringement, and specific features of each product. Lastly, include an overall risk assessment.
      Example Output Format:
      {
          "top_infringing_products": [
            {
              "product_name": "Product Name",
              "infringement_likelihood": "High/Moderate/Low",
              "relevant_claims": ["Claim Numbers"],
              "explanation": "Explanation of how this product may infringe on the patent claims, based on specific features.",
              "specific_features": ["List of specific features relevant to infringement"]
            },
            // second product
          ],
          "overall_risk_assessment": "Overall infringement risk assessment considering all relevant products and claims."
      }
    `;
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
      });
      return { status: "success", data: response.choices[0].message.content.trim() };
    } catch (error) {
        console.error("OpenAI API Error:", error);
      return { status: "error", message: "Failed to generate report." };
    }
}

app.post('/api/check-infringement', async (req, res) => {
    const { patentID, companyName } = req.body;
    const results = await checkInfringementWithOpenAI(patentID, companyName);

    if (results.status === "error") {
        return res.json(results);
    }

    const parsedResults = typeof results.data === "string" ? {...results, data: JSON.parse(results.data)} : results;
    res.json({
        ...parsedResults,
        data: {
            "patent_id": patentID,
            "company_name": companyName,
            "analysis_date": new Date().toISOString(),
            ...parsedResults.data
        },
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
