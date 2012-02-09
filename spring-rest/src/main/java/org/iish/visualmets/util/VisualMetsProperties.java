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

import org.apache.log4j.Logger;
import java.io.*;
import java.text.MessageFormat;
import java.util.*;

/**
 * This class fetches the visualmets.properties file.
 * It checks for expected keys and refuses to instantiate if there are
 * missing properties.
 *
 * @author Lucien van Wouw <lwo@iisg.nl>
 */

public class VisualMetsProperties extends Properties {

    private static final long serialVersionUID = 7526471155622776147L;
    private Map<String,Map> client_server_settings;
    private Logger log = Logger.getLogger(getClass());

    public VisualMetsProperties() {

        String systemProperty = "visualmets";
        String visualMetsProperties = "";
        InputStream inputStream = null;
        try {
            // Should be added at startup
            visualMetsProperties = System.getProperty(systemProperty);
            if (visualMetsProperties != null) {
                log.info("Found system property '"+systemProperty+"', resolved to " + new File(visualMetsProperties).getCanonicalPath());
            }
            inputStream = getInputFromFile(visualMetsProperties);
            if (inputStream == null) {
                log.info("System property '"+systemProperty+"' not found, checking environment for '"+systemProperty+"'.");
                visualMetsProperties = System.getenv(systemProperty);
                if (visualMetsProperties != null) {
                    log.info("Found env property '"+systemProperty+"', resolved to " + new File(visualMetsProperties).getCanonicalPath());
                }
                inputStream = getInputFromFile(visualMetsProperties);
            }
        }
        catch (Exception e) {
            log.fatal("Error in resolving file defined with " + visualMetsProperties);
            System.exit(1);
        }
        if (inputStream == null) {
            log.fatal(
                    "Configuration not available!\n" +
                            "Solutions:\n" +
                            "1) Start the JVM with parameter -Dvisual-mets.properties=/path/to/"+systemProperty+".properties\n" +
                            "2) Set the environment variable 'visual-mets' to /path/to/"+systemProperty+".properties"
            );
            System.exit(1);
        }
        try {
            load(inputStream);
        }
        catch (IOException e) {
            log.fatal("Unable to load '"+systemProperty+"'.properties' from input stream!");
            System.exit(1);
        }
        boolean complete = true;
        for (String expect : EXPECT) {
            String value = getProperty(expect);
            if (value == null) {
                log.warn(MessageFormat.format("Missing property ''{0}''", expect));
                complete = false;
            }
        }
        if (!complete) {
            log.fatal("Configuration properties incomplete. Check log of this class for warnings.");
            System.exit(1);
        }

        client_server_settings = new HashMap();
        setClientResources(getProperty("client_prefix"));
    }

    private InputStream getInputFromFile(String filePath) {
        if (filePath != null) {
            try {
                log.info("Going to load properties from '" + filePath + "', resolved to " + new File(filePath).getCanonicalPath());
                return new FileInputStream(filePath);
            }
            catch (FileNotFoundException e) {
                throw new RuntimeException("No file found: " + filePath, e);
            }
            catch (IOException e) {
                throw new RuntimeException("IO exception on: " + filePath, e);
            }
        }
        else {
            return null;
        }
    }

    private void setClientResources(String prefix)
    {
        for (Map.Entry<Object, Object> entry : this.entrySet()) {
            String key = ((String)entry.getKey());
            if ( key.startsWith(prefix))
            {
                String[] keys = key.split("\\.");

                addToMap(client_server_settings, keys, keys.length - 1, (String)entry.getValue());
            }
        }
    }

    private void addToMap(Map map, String[] keys, int index, String value)
    {
        String key = keys[keys.length - index] ;
        Map<String,Map> submap = (Map)map.get(key);
        if ( submap == null )
        {
            if ( index == 1 )
            {
                map.put(key, value);
                log.debug("Adding client\\server property: {key:"+key+",value:"+value+"}");
                return;
            }

            submap = new HashMap();
            map.put(key, submap);
        }

        addToMap(submap, keys, index - 1, value);
    }

    public Map getClientResources()
    {
        return this.client_server_settings;
    }

    private static String[] EXPECT = {
            "log4j.xml",
            "solr.archives.selectUrl",
            "message.resource"
    };
}