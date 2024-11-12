import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  logo: { type: String, required: false },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const CompanyModel = mongoose.model("Company", CompanySchema);

export const createCompany = (values: Record<string, any>) =>
  new CompanyModel(values).save().then((company) => company.toObject());

export const deleteCompany = (id: string) => CompanyModel.findOneAndDelete({ _id: id});
export const getCompany = (id: string) => CompanyModel.findById(id)