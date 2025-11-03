import { useMutation } from "@tanstack/react-query";

export const useAddressMutations = (
  axiosSecure,
  userEmail,
  refetch,
  callbacks
) => {
  const addMutation = useMutation({
    mutationFn: (newAddress) =>
      axiosSecure.post(`/address?email=${userEmail}`, newAddress),
    onSuccess: () => {
      refetch();
      callbacks.onAddSuccess?.();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) =>
      axiosSecure.put(`/address/${id}?email=${userEmail}`, data),
    onSuccess: () => {
      refetch();
      callbacks.onUpdateSuccess?.();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.delete(`/address/${id}?email=${userEmail}`),
    onSuccess: () => {
      refetch();
      callbacks.onDeleteSuccess?.();
    },
  });

  const setDefaultShippingMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.put(
        `/address/${id}/default-shipping?email=${userEmail}`
      ),
    onSuccess: () => {
      refetch();
      callbacks.onDefaultShippingSuccess?.();
    },
  });

  const setDefaultBillingMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.put(
        `/address/${id}/default-billing?email=${userEmail}`
      ),
    onSuccess: () => {
      refetch();
      callbacks.onDefaultBillingSuccess?.();
    },
  });

  return {
    addMutation,
    updateMutation,
    deleteMutation,
    setDefaultShippingMutation,
    setDefaultBillingMutation,
  };
};