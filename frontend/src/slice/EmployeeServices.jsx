import axiosconfig from "../axiosconfig";

export const Employeeform = async (name, email, phone ) => {
  try {
    const response = await axiosconfig.post("/add", {name, email, phone});
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error.response?.data || { message: "Something went wrong" };

  }
};
export const GetEmployee=async()=>
{
  try {
    const response =await axiosconfig.get('/all');
    console.log(response.data);
    return response.data
    
  } catch (error) {
    console.log("Error fetching",error);
  }
}
export const DeleteEmployee=async(id)=>
{
  try {
    await axiosconfig.delete(`/delete/${id}`);
    return id;
    

  } catch (error) {
    console.log(error)
    
  }
}