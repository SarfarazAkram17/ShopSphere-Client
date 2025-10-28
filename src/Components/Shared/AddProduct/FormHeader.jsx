// eslint-disable-next-line no-unused-vars
export const FormHeader = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/80 rounded-2xl mb-4 shadow-lg">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
        {title}
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto text-base">{description}</p>
    </div>
  );
};