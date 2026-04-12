import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { notifyError, notifySuccess } from "@utils/toast";
import RatingServices from "@services/RatingServices";

const useReviewSubmit = ({customer, product}) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ comment }) => {
    if (!customer) {
        await router.push("/auth/login");
        return;
    }
    setLoading(true);
    try {
        const ratingData = {
            customer: customer,
            product: product,
            rating: Number(rating),
            comment: comment
        };
    
        const res = await RatingServices.addRating(ratingData);
        notifySuccess(res.message);
        setLoading(false);
        reset()
        router.reload();
    } catch (err) {
        notifyError(err ? err?.response?.data?.message : err?.message);
        setLoading(false);
    }
  };

  return {
    rating,
    setRating,
    register,
    errors,
    loading,
    handleSubmit,
    submitHandler,
  };
};

export default useReviewSubmit;
