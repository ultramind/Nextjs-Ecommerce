export const identity_docs = [
    { value: "NIN", label: "National Identity Number" },
    { value: "IP", label: "Passport" },
    { value: "DL", label: "Driver's License" },
];

export const getLabel = (
    value: string,
    from: "value" | "label",
    get: "value" | "label",
) => {
    if (value) {
        const res = identity_docs.find((doc) => doc[from] === value);

        if (res) {
            return res[get];
        }
        return "";
    }
    return "";
};