// eslint-disable-next-line no-unused-vars
export const FormHeader = ({ icon: Icon, title, description, productName }) => {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/80 rounded-2xl mb-4 shadow-lg">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
        {title}
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto text-base">{description}</p>
      {productName && (
        <div className="mt-4 inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <p className="text-sm text-gray-700">
            Editing:{" "}
            <span className="font-semibold text-primary">{productName}</span>
          </p>
        </div>
      )}
    </div>
  );
};