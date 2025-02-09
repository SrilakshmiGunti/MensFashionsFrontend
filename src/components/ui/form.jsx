import React from "react";

export function Form({ fields, formData, setFormData, buttonText, onSubmit }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          {field.componentType === "select" ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
            >
              {field.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.componentType}
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
      <button type="submit">{buttonText}</button>
    </form>
  );
}