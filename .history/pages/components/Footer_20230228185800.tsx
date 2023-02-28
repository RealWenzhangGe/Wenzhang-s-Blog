import { AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn, FaGithub, FaInstagram, FaWeixin } from "react-icons/fa";
import { Popover } from 'antd';
import Image from 'next/image';

const QRCodeImage = (
  <>
  <Image src="/QRCode.png" alt="QRCode" width="320" height="320"/>
  </>
);

function Footer() {
 return (
   <>
     <div
       className="flex flex-col items-start justify-around w-full h-auto pt-20 md:flex-row"
       id="contact"
     >
       <div className="p-5">
         <ul>
           <p className="pb-6 font-serif text-3xl text-center text-gray-800 cursor-pointer">
             Wenzhang's Blog
           </p>
           <div className="flex gap-6 pb-4">
             <a href="mailto:wenzhangge06@qq.com">
               {" "}
               <AiOutlineMail className="text-2xl cursor-pointer hover:text-gray-600" />
             </a>
             <a
               href="https://www.linkedin.com/in/wenzhang-ge-5679a821b/"
               target="_blank"
             >
               {" "}
               <FaLinkedinIn className="text-2xl cursor-pointer hover:text-blue-600" />
             </a>
             <a href="https://github.com/RealWenzhangGe" target="_blank">
               {" "}
               <FaGithub className="text-2xl cursor-pointer hover:text-gray-600" />
             </a>
             <a href="https://www.instagram.com/wenzhang.ge/" target="_blank">
               {" "}
               <FaInstagram className="text-2xl cursor-pointer hover:text-gray-600" />
             </a>
             <Popover content={QRCodeImage} trigger="hover">
              {" "}
              <FaWeixin className="text-2xl cursor-pointer hover:text-gray-600" />
             </Popover>
            </div>             
         </ul>
       </div>
     </div>
     <div className="flex flex-col items-center justify-center p-5 text-center bg-gray-50">
       <h1 className="font-semibold text-gray-800 ">
         © 2023 All rights reserved | Built with ❤ by{" "}
         <span className="font-semibold cursor-pointer hover:text-blue-600">
           Wenzhang{" "}
         </span>
       </h1>
     </div>
   </>
 );
}

export default Footer;