"use client";

import authInstance from "@/_api/auth";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const steps = ["City", "Customer", "Pricing"];

const cities = [
  { id: 1, city: "Delhi" },
  { id: 2, city: "New Delhi" },
  { id: 3, city: "Noida" },
  { id: 4, city: "Greater Noida" },
  { id: 5, city: "Ghaziabad" },
  { id: 6, city: "Faridabad" },
  { id: 7, city: "Gurugram" },
  { id: 8, city: "Gurgaon" },
  { id: 9, city: "Sonipat" },
  { id: 10, city: "Bahadurgarh" },
  { id: 11, city: "Jhajjar" },
  { id: 12, city: "Rohtak" },
  { id: 13, city: "Palwal" },
  { id: 14, city: "Bhiwadi" },
  { id: 15, city: "Rewari" },
  { id: 16, city: "Meerut" },
  { id: 17, city: "Hyderabad" }
];

const CreateQuotation = () => {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    city: "",
    dob: "",
    crn: "",
    name: "",
    contactNumber: "",
    address: "",
    description: "",
    products: "",
    process: "",
    area: "",
    prices: "",
    total: "",
    discounts: "",
    payable: "",
    region: "",
    areaSqFt: "",
  });
  const prevCityRef = useRef("");
  const [getProduct, setGetProduct] = useState([]);
  const [getCategory, setGetCategory] = useState([]);
  const [rates, setRates] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);
  const productsByCategory =
    rates[formData.description] || [];
  const [processType, setProcessType] = useState([
    "Fresh", "Repair"
  ]);
  const selectedProductRate = productsByCategory.find(
    (item) => item.product === formData.products
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const getGenerateCRN = async () => {
    try {
      let reqBody = { city: formData?.city }
      const res = await authInstance.generateCRN(reqBody)
      console.log("res of getGenerateCRN", res)
      if (res?.success) {
        setFormData((p) => ({ ...p, crn: res.data }));
      }
    } catch (error) {
      console.error("Failed to generate CRN", error);
    }
  };
  const getProductList = async () => {
    setLoadingProducts(true);
    try {
      let reqBody = { city: formData?.city }
      const res = await authInstance.getProduct(reqBody)
      console.log("res of product list------", res, res?.data?.rates);
      if (res?.success) {
        setLoadingProducts(false);
        setRates(res?.data?.rates || {});
        setGetProduct(res?.data?.products || []);
        setGetCategory(Object.keys(res?.data?.rates));
        setFormData((prev) => ({
          ...prev,
          region: res?.data?.region,
        }));
      }
    } catch (error) {
      console.error("Failed to generate CRN", error);
    }
  };
  const handleSubmit = async () => {
    try {
      const reqBody = {
        city: formData.city.toLowerCase(),
        region: formData.region || "", // static or make dynamic later
        crn: formData.crn,
        quotationDate: new Date().toISOString().split("T")[0],

        customerName: formData.name,
        customerContact: formData.contactNumber,
        customerAddress: formData.address,

        items: [
          {
            category: formData?.description, // static or from product API
            process: formData.process,
            area: formData.areaSqFt,
            product: formData?.products || "",
            areaSqFt: Number(formData.prices || 0)
          }
        ],

        discountPercent: Number(formData.discounts || 0)
      };

      console.log("Quotation reqBody --->", reqBody);

      const response = await authInstance.generateQuotation(reqBody);
      console.log("response of generate quotation------------", response)
      if (response?.success) {
        toast.success("Quotation generated successfully");
        setPdfLink(response?.data?.url);
        handleDownload(response?.data?.url)
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Quotation generation failed", error);
    }
  };
  const handleDownload = (url) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotation.pdf"; // file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  useEffect(() => {
    if (formData.city && prevCityRef.current !== formData.city) {
      prevCityRef.current = formData.city;
      getGenerateCRN();
    }
  }, [formData.city]);

  useEffect(() => {
    if (step === 2 && formData.city) {
      getProductList();
    }
  }, [step]);

  useEffect(() => {
    const area = Number(formData.area);

    if (!selectedProductRate || !area || !formData.process) {
      setFormData((p) => ({ ...p, prices: "" }));
      return;
    }

    const rate =
      formData.process === "fresh"
        ? selectedProductRate.fresh
        : selectedProductRate.re;

    setFormData((p) => ({
      ...p,
      total: area * rate,
      prices: rate,
    }));
  }, [
    formData.area,
    formData.process,
    formData.products,
    formData.description,
  ]);
  useEffect(() => {
    const total = Number(formData.total);
    const discountPercent = Number(formData.discounts);

    if (!total) {
      setFormData((p) => ({ ...p, payable: "" }));
      return;
    }

    const discountAmount = (total * discountPercent) / 100;
    const payable = total - discountAmount;

    setFormData((p) => ({
      ...p,
      payable: payable,
    }));
  }, [formData.total, formData.discounts]);
  useEffect(() => {
    if (!pdfLink) return;

    const link = document.createElement("a");
    link.href = pdfLink;
    link.download = "quotation.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfLink]);



  console.log("formData-----------------------", formData, getCategory, rates)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff4e6] px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-6">

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Create Quotation
        </h1>

        {/* Stepper */}
        <div className="flex items-center justify-center">
          {steps.map((label, i) => (
            <div key={label} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
                  ${i <= step ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {i + 1}
              </div>
              {i !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2
                    ${i < step ? "bg-orange-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500">
          Step {step + 1}: {steps[step]}
        </p>

        {/* STEP 1 – City */}
        {step === 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Select City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`input ${!formData.city && step > 0 ? "input-error" : ""}`}
            // className="w-full border rounded-lg p-3 focus:outline-orange-400 "
            >
              <option value="" className="text-black">Select City</option>
              {cities.map((item) => (
                <option key={item.id} value={item.city}>
                  {item.city}
                </option>
              ))}
            </select>
          </div>
        )}


        {/* STEP 2 – Customer */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* DOB */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Select DOB</label>
              <input
                name="dob"
                type="date"
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* CRN */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Auto Generate CRN No.
              </label>
              <input
                name="crn"
                placeholder="CRN"
                value={formData.crn}
                readOnly
                className="input bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Customer Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                name="name"
                placeholder="Enter customer name"
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Contact Number */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                name="contactNumber"
                placeholder="Enter contact number"
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                placeholder="Enter full address"
                onChange={handleChange}
                className="input"
              />
            </div>

          </div>

        )}

        {/* STEP 3 – Pricing */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input"
                disabled={loadingProducts}
              >
                <option value="">
                  {loadingProducts ? "Loading Category..." : "Select Category"}
                </option>
                {getCategory.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Product */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Product
              </label>
              <select
                name="products"
                value={formData.products}
                onChange={handleChange}
                className="input"
                disabled={!formData.description || loadingProducts}
              >
                <option value="">
                  {loadingProducts ? "Loading products..." : "Select Product"}
                </option>
                {productsByCategory.map((item, index) => (
                  <option key={index} value={item.product}>
                    {item.product}
                  </option>
                ))}
              </select>
            </div>

            {/* Process */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Process
              </label>
              <select
                name="process"
                value={formData.process}
                onChange={handleChange}
                className="input"
                disabled={!formData.description || loadingProducts}
              >
                <option value="">
                  {loadingProducts ? "Loading..." : "Select Process"}
                </option>
                {processType.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Area (Paintable) */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Paintable Area
              </label>
              <input
                type="text"
                name="areaSqFt"
                value={formData.areaSqFt}
                placeholder="Area to paint"
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Area (sqft) */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Area (sqft)
              </label>
              <input
                name="area"
                value={formData.area}
                placeholder="Enter area in sqft"
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Rate / Price */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Rate
              </label>
              <input
                name="prices"
                value={formData.prices}
                readOnly
                placeholder="Price per sqft"
                className="input bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Discount */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Discount (%)
              </label>
              <input
                name="discounts"
                type="number"
                min="0"
                max="100"
                value={formData.discounts}
                onChange={handleChange}
                placeholder="Discount %"
                className="input"
              />
            </div>

            {/* Total */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Total Amount
              </label>
              <input
                name="total"
                value={formData.total}
                readOnly
                placeholder="Total"
                className="input bg-gray-100"
              />
            </div>

            {/* Payable */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Payable Amount
              </label>
              <input
                name="payable"
                value={formData.payable}
                readOnly
                placeholder="Payable Amount"
                className="input bg-gray-100"
              />
            </div>

          </div>

        )}

        {/* Buttons */}
        {/* <div className="flex justify-between pt-4">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border rounded-lg bg-orange-500 text-white"
            >
              Back
            </button>
          )}

          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto bg-orange-500 text-white px-6 py-2 rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="ml-auto bg-orange-500 text-white px-6 py-2 rounded-lg"
            >
              Send Quotation
            </button>
          )}
          {pdfLink && (
            <button
              onClick={() => handleDownload(pdfLink)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              Download Quotation PDF
            </button>
          )}

        </div> */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-4">
          <div className="flex gap-2 justify-start">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border rounded-lg bg-orange-500 text-white"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 rounded-lg bg-orange-500 text-white"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-orange-500 text-white"
              >
                Send Quotation
              </button>
            )}

            {pdfLink && (
              <button
                onClick={() => handleDownload(pdfLink)}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white"
              >
                Download Quotation PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuotation;
