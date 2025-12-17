import CreateQuotation from "@/app/create-quotation/page";

export const HttpMethod = {
    Get: "GET",
    Post: "POST",
    Put: "PUT",
    Patch: "PATCH",
    Delete: "DELETE",
};

const ApiRoutes = {
    Auth: {
        Login: {
            Endpoint: "/auth/login",
            Method: HttpMethod.Post,
        },
        GenerateCRN: {
            Endpoint: "/quotation/generate-crn",
            Method: HttpMethod.Post
        },
        GetProduct: {
            Endpoint: (city) =>
                `/quotation/get-pricing?city=${encodeURIComponent(city)}`,
            Method: HttpMethod.Get,
        },
         GenerateQuotation: {
            Endpoint:
                `/quotation/generate-quotation`,
            Method: HttpMethod.Post,
        }


    }
}
export default ApiRoutes;