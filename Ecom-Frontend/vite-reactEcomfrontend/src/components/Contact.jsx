/**
 * @file Contact — Static contact page.
 * @description
 * - Displays a contact form with name, email, and message fields (non-functional / no submission handler).
 * - Shows business contact information: phone number, email address, and physical address.
 * - Uses a full-screen background image (pexels4) with a centered white card overlay.
 * @usage App.jsx — route `/contact`.
 */
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import pexels4 from "../assets/sliders/pexels4.jpg";

const Contact = () =>{

    
    return(

    <div
       className="flex flex-col items-center justify-center min-h-screen py-12 bg-cover bg-center"
      style={{
      backgroundImage: `url(${pexels4})`,
    }}
  >
        
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
            <h1 className="text-4xl font-bold text-center mb6">Contact Us</h1>
            <p className="text-gray-600 text-center mb-4">
                We would love to hear from you! Please fill out the form below or contact us
            </p>
            <form className="space-y-4">
               <div>
                <label className="block textsm font-medium text-gray-700">
                    Name
                </label>
                <input 
                   type="text"
                   required
                   className="mt-1 block w-full border border-gray-300 rounded-lg p-2 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
               </div>

               <div>
                <label className="block textsm font-medium text-gray-700">
                    Email
                </label>
                <input 
                   type="email"
                   required
                   className="mt-1 block w-full border border-gray-300 rounded-lg p-2 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
               </div>

               <div>
                <label className="block textsm font-medium text-gray-700">
                    Message
                </label>
                <textarea
                   rows="4"
                   required
                   className="mt-1 block w-full border border-gray-300 rounded-lg p-2 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
               </div>

               <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Send Message
               </button>
            </form>

            <div className ="mt-8 text-center">
                <h2 className="text-lg font-semibold">Contact Information</h2>
                <div className="flex flex-col items-center space-y-2 mt-4">
                    <div className="flex items-center">
                        <FaPhone className="text-blue-500 mr-2"/>
                        <span className="text-gray-600">+1 (573) 466 6199</span>
                    </div>
                    <div className="flex items-center">
                        <FaEnvelope className="text-blue-500 mr-2"/>
                        <span className="text-gray-600">boatengsamuel237@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                        <FaMapMarkerAlt className="text-blue-500 mr-2"/>
                        <span className="text-gray-600">305 W 9th St Apt 205, Rolla</span>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
);
}

export default Contact;