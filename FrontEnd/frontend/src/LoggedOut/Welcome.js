import {React,useEffect} from "react";
import axios from "axios";


const Welcome = (props) =>{
    /*React.useEffect( ()=>{
        try{
          axios.get("http://192.168.1.7:8000/api/user/").then((response)=>{
            alert(response.data.user_number);
          })
    
        }catch(e){
          console.log(e);
        }
      },[])*/
    const submitForm=(e)=>{
        e.preventDefault();
        axios.post("http://192.168.1.7:8000/api/user/",{
            email : e.target.email.value,
            password : e.target.password.value
        }).then((response)=>{
            console.log(response.data.status);
        },(error)=>{
            console.log(error)
        });
    }


    return (
        
        <div className="form-back">
        <div className="form-container">
          <div className="form-content-right">
            <form className="form" onSubmit={(e) => submitForm(e)} noValidate>
              <h1>Log in </h1>
              <div className = "d-flex flex-column ">
                <div className="form-inputs d-flex justify-content-between ">
                    <label className="form-label">Email</label>
                    <input
                    className="form-input"
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    />
                </div>
                <div className="form-inputs d-flex justify-content-between">
                    <label className="form-label">Password</label>
                    <input
                    className="form-input"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    />
                </div>
              </div>
  
              <button className="form-input-btn btn btn-primary" type="submit">
                Log in
              </button>
            </form>
              <span className="btn btn-secondary mt-4">
                Create a new account 
              </span>
          </div>
        </div>
      </div>
    )
}
export default Welcome;