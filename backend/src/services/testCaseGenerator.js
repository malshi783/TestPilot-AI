// ==========================================
// TestPilot-AI
// Gemini AI Test Case Generator
// ==========================================

const DEFAULT_BASE_URL =
    "https://generativelanguage.googleapis.com/v1beta";

const DEFAULT_MODEL = "gemini-3.8-flash";

const REQUEST_TIMEOUT_MS = 45000;


// ==========================================
// 1. Local Demo Fallback
// ==========================================

const fallbackCases = (requirement) => [

    {
        title: "Successful scenario",

        description:
            "Verify that the feature works with valid input.",

        preconditions:
            "The application is available and the required test account or data exists.",

        test_steps: [
            "Open the relevant page or feature.",
            "Enter valid information that matches the requirement.",
            "Submit the action."
        ],

        expected_result:
            "The action completes successfully and the expected result is displayed.",

        test_type: "MANUAL"
    },

    {
        title: "Required information is missing",

        description:
            "Verify that the application validates required fields.",

        preconditions:
            "The relevant page or feature is available.",

        test_steps: [
            "Open the relevant page or feature.",
            "Leave one required field empty.",
            "Submit the action."
        ],

        expected_result:
            "A clear validation message is displayed and the action is not completed.",

        test_type: "MANUAL"
    },

    {
        title: "Invalid or boundary information",

        description:
            `Check invalid and boundary values for this requirement:
            ${String(requirement).slice(0, 160)}`,

        preconditions:
            "The relevant page or feature is available.",

        test_steps: [
            "Open the relevant page or feature.",
            "Enter an invalid or boundary value relevant to the requirement.",
            "Submit the action."
        ],

        expected_result:
            "Invalid information is handled safely with a useful message, and the application remains stable.",

        test_type: "MANUAL"
    }

];


// ==========================================
// 2. Validate Generated Test Cases
// ==========================================

function cleanCases(value) {

    if (!Array.isArray(value)) {

        throw new Error(
            "Gemini did not return a test_cases array."
        );

    }

    const cases = value.slice(0, 8).map((item, index) => {

        if (
            !item ||
            typeof item !== "object" ||
            Array.isArray(item)
        ) {

            throw new Error(
                `Generated test case ${index + 1} is not a valid object.`
            );

        }

        const steps = Array.isArray(item.test_steps)

            ? item.test_steps
                .map((step) => String(step).trim().slice(0, 400))
                .filter(Boolean)
                .slice(0, 12)

            : [];

        const title = String(
            item.title || `Test case ${index + 1}`
        )
            .trim()
            .slice(0, 200);

        const expectedResult = String(
            item.expected_result || ""
        )
            .trim()
            .slice(0, 1500);

        if (
            !title ||
            !expectedResult ||
            steps.length === 0
        ) {

            throw new Error(
                `Generated test case ${index + 1} is missing required information.`
            );

        }

        return {

            title,

            description: String(
                item.description || ""
            )
                .trim()
                .slice(0, 2000),

            preconditions: String(
                item.preconditions || ""
            )
                .trim()
                .slice(0, 1000),

            test_steps: steps,

            expected_result: expectedResult,

            // All generated test cases are manual.
            test_type: "MANUAL"

        };

    });

    if (cases.length === 0) {

        throw new Error(
            "Gemini did not generate any valid test cases."
        );

    }

    return cases;

}


// ==========================================
// 3. Parse Gemini JSON Response
// ==========================================

function parseJsonResponse(text) {

    const cleaned = String(text)

        .trim()

        .replace(/^```(?:json)?\s*/i, "")

        .replace(/\s*```$/i, "");

    try {

        return JSON.parse(cleaned);

    } catch (_error) {

        const firstBrace = cleaned.indexOf("{");

        const lastBrace = cleaned.lastIndexOf("}");

        if (
            firstBrace >= 0 &&
            lastBrace > firstBrace
        ) {

            try {

                return JSON.parse(
                    cleaned.slice(firstBrace, lastBrace + 1)
                );

            } catch (_parseError) {

                // Continue to the clear error below.

            }

        }

        throw new Error(
            "Gemini returned invalid JSON. Please try again."
        );

    }

}


// ==========================================
// 4. Generate Test Cases Using Gemini API
// ==========================================

async function generateTestCases(requirement) {

    const requirementText = String(
        requirement || ""
    ).trim();

    if (!requirementText) {

        throw new Error(
            "A requirement description is required."
        );

    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();


    // --------------------------------------
    // Use Local Demo if API Key is Missing
    // --------------------------------------

    if (!apiKey) {

        return {

            cases: fallbackCases(requirementText),

            source: "local-demo"

        };

    }


    // --------------------------------------
    // Gemini API Configuration
    // --------------------------------------

    const baseUrl = (

        process.env.GEMINI_BASE_URL ||
        DEFAULT_BASE_URL

    ).replace(/\/+$/, "");

    const model =
        process.env.GEMINI_MODEL || DEFAULT_MODEL;

    const endpoint =
        `${baseUrl}/models/${encodeURIComponent(model)}:generateContent`;


    // --------------------------------------
    // System Instructions
    // --------------------------------------

    const systemInstruction = [

        "You are an experienced Software Quality Assurance engineer.",

        "Create 4 to 6 specific, practical manual test cases based on the supplied software requirement.",

        "Include positive, negative, required-field validation, and boundary scenarios where relevant.",

        "Avoid generic test steps when the requirement provides specific information.",

        "Each test case must contain title, description, preconditions, test_steps as an array of strings, and expected_result.",

        "Do not claim that any test has been executed.",

        "Return only JSON matching the required schema."

    ].join(" ");


    // --------------------------------------
    // JSON Response Schema
    // --------------------------------------

    const responseSchema = {

        type: "object",

        properties: {

            test_cases: {

                type: "array",

                items: {

                    type: "object",

                    properties: {

                        title: {
                            type: "string"
                        },

                        description: {
                            type: "string"
                        },

                        preconditions: {
                            type: "string"
                        },

                        test_steps: {

                            type: "array",

                            items: {
                                type: "string"
                            }

                        },

                        expected_result: {
                            type: "string"
                        }

                    },

                    required: [
                        "title",
                        "description",
                        "preconditions",
                        "test_steps",
                        "expected_result"
                    ]

                }

            }

        },

        required: ["test_cases"]

    };


    // --------------------------------------
    // Send Request to Gemini
    // --------------------------------------

    let response;

    try {

        response = await fetch(

            endpoint,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "x-goog-api-key": apiKey

                },

                body: JSON.stringify({

                    systemInstruction: {

                        parts: [
                            {
                                text: systemInstruction
                            }
                        ]

                    },

                    contents: [

                        {

                            role: "user",

                            parts: [

                                {
                                    text: requirementText
                                }

                            ]

                        }

                    ],

                    generationConfig: {

                        temperature: 0.2,

                        maxOutputTokens: 3000,

                        responseMimeType: "application/json",

                        responseJsonSchema: responseSchema

                    }

                }),

                signal: AbortSignal.timeout(
                    REQUEST_TIMEOUT_MS
                )

            }

        );

    } catch (error) {

        if (
            error.name === "TimeoutError" ||
            error.name === "AbortError"
        ) {

            throw new Error(
                "Gemini request timed out. Please try again."
            );

        }

        throw new Error(
            `Could not connect to Gemini API: ${error.message}`
        );

    }


    // --------------------------------------
    // Read API Response
    // --------------------------------------

    const data = await response.json().catch(() => ({}));


    // --------------------------------------
    // Handle Gemini API Errors
    // --------------------------------------

    if (!response.ok) {

        const providerMessage =
            data.error?.message ||
            "No additional error details were returned.";

        if (response.status === 400) {

            throw new Error(
                `Gemini rejected the request (HTTP 400): ${providerMessage}`
            );

        }

        if (response.status === 403) {

            throw new Error(
                `Gemini access was denied. Check API key and project access: ${providerMessage}`
            );

        }

        if (response.status === 404) {

            throw new Error(
                `Gemini model or endpoint was not found. Check GEMINI_MODEL: ${providerMessage}`
            );

        }

        if (response.status === 429) {

            throw new Error(
                `Gemini quota or rate limit reached. Check your Free Tier limits: ${providerMessage}`
            );

        }

        throw new Error(
            `Gemini API request failed (HTTP ${response.status}): ${providerMessage}`
        );

    }


    // --------------------------------------
    // Extract Generated Content
    // --------------------------------------

    const candidate = data.candidates?.[0];

    const content = candidate?.content?.parts

        ?.map((part) => (
            typeof part.text === "string"
                ? part.text
                : ""
        ))

        .join("\n")

        .trim();


    if (!content) {

        const reason =
            candidate?.finishReason || "unknown reason";

        throw new Error(
            `Gemini returned no text content. Finish reason: ${reason}`
        );

    }


    // --------------------------------------
    // Convert JSON into JavaScript Object
    // --------------------------------------

    const parsed = parseJsonResponse(content);


    // --------------------------------------
    // Return Generated Test Cases
    // --------------------------------------

    return {

        cases: cleanCases(parsed.test_cases),

        source: "gemini"

    };

}


// ==========================================
// Export Function
// ==========================================

module.exports = {
    generateTestCases
};