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
import org.springframework.web.util.UriUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.LinkedHashMap;

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

    private static int cache_request_limit = 1000;
    private static final LinkedHashMap cache = new LinkedHashMap(cache_request_limit);
    private static final int MAX_REDIRECT_ATTEMPTS = 10;

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
            response.setContentType("application/json; charset=utf-8");
            mav.addObject("callback", callback.trim());
        }

        return mav;
    }

    public static String redirect(String url) throws IOException {
        return redirect(UriUtils.encodeHttpUrl(url, "utf-8"), 0);
    }

    /**
     * Check response code and Location header field value for redirect information.
     * If any return the new domain and protocol.
     *
     * @param url the target url. Could be a handle.
     * @return A resolvable url
     */
    private static String redirect(String url, int depth) throws IOException {
        if ( cache_request_limit++ % 1000 == 0 )
            cache.clear();
        if ( cache.containsKey(url)) return (String) cache.get(url);
        URL server = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) server.openConnection();
        int resultCode = connection.getResponseCode();
        String location = connection.getHeaderField("Location");
        connection.disconnect();
        if ( resultCode == HttpServletResponse.SC_OK || location == null ) {
            return url;
        }
        else
            if ( depth < MAX_REDIRECT_ATTEMPTS ) {
                cache.put(url, location);
                return redirect(location, depth + 1);
            }
            else
                throw new IOException("Too many redirect attempts");
    }
}