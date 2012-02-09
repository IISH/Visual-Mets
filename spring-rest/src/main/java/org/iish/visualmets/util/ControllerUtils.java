/*
 * Copyright 2010 International Institute for Social History, The Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.iish.visualmets.util;

import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;

/*
 * Simple utility methods, accessible to all classes.
 *
 * Created by IntelliJ IDEA.
 * Date: 16-okt-2010
 * Time: 11:15:02
 *
 * @author: Lucien van Wouw <lwo@iisg.nl>
 */

public class ControllerUtils {

    /**
     * Determines the type of template: JSON or XML.
     * When the client uses a callback function with a tagname, it is assumed the response is JSON.
     * If NULL the XML template is selected.
     *
     * @param viewName Prefix of the template
     * @param callback JSONP tagname
     * @param response
     * @return the FreeMarker template
     */
    public static ModelAndView createModelAndViewPage(String viewName, String callback, HttpServletResponse response) {

        String template = (callback == null)
                ? viewName.concat(".xml")
                : viewName.concat(".json");

        ModelAndView mav = new ModelAndView(template);

        if ( callback == null )
        {
            response.setContentType("text/xml; charset=utf-8");
        }
        else
        {
            mav.addObject("callback", callback.trim());
        }

        return mav;
    }
}