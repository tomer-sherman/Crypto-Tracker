import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../../pages-area/home/home";
import { Reports } from "../../pages-area/reports/reports";
import { Recommendation } from "../../pages-area/recommendation/recommendation";
import { About } from "../../pages-area/about/about";


export function Routing() {
    return (
        <div className="Routing">

			<Routes>

                <Route path="/" element={<Navigate to={"home"}/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/reports" element={<Reports/>}/>
                <Route path="/recommendation" element={<Recommendation/>}/>
                <Route path="/about" element={<About/>}/>
              
            </Routes>

        </div>
    );
}
