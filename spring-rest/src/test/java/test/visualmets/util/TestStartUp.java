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
package test.visualmets.util;

import org.junit.Ignore;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.webapp.WebAppContext;

/*
* Bootstrap for testing. This way we do not need to build a target.
* To debug we only need to stop and start this instance.
* 
* Created by IntelliJ IDEA.
* Date: 16-okt-2010
* Time: 18:56:22
*
* @author: Lucien van Wouw <lwo@iisg.nl>
*/
@Ignore
public class TestStartUp {
    private static TestStartUp server;

        public static void main(String... args) throws Exception
        {
            server = new TestStartUp();
            server.Start();
        }

    private Server Start() throws Exception
    {
        int port = 8070;
        Server server = new Server(port);

        if ( System.getProperty("visualmets") == null )
            System.setProperty("visualmets", "./visualmets.properties");

        server.addHandler(new WebAppContext("./spring-rest/src/main/webapp", "/"));

        server.start();

        return server ;
    }
}
