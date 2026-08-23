/*
    This file holds the Routing component of the app.
    It maps each address in the browser to the page that should be shown.
    The pages are Home, Reports, Recommendation, and About.
    An empty address is sent straight to the Home page.
*/

import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../../pages-area/home/home";
import { Reports } from "../../pages-area/reports/reports";
import { Recommendation } from "../../pages-area/recommendation/recommendation";
import { About } from "../../pages-area/about/about";


// Picks the page to show by address
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
