package org.iisg.bootstrap;

import org.mortbay.jetty.Server;
import org.mortbay.jetty.webapp.WebAppContext;

/**
 * Created by IntelliJ IDEA.
 * User: lwo
 * Date: 9-jul-2009
 * Time: 10:49:29
 *
 * Startup our Jetty server to bootstrap our projects
 */

public class StartUp
{

    private static StartUp server;

        public static void main(String... args) throws Exception
        {
            server = new StartUp();
            server.Start();
        }

    private Server Start() throws Exception
    {
        int port = 8983;
        Server server = new Server(port);

        if ( System.getProperty("solr.solr.home") == null )
            System.setProperty("solr.solr.home", "./solrserver/solr");

        // launch the Solr server
        server.addHandler(new WebAppContext("solrserver/apache-solr-1.4.1.war", "/solr"));

        //server.addHandler(new WebAppContext("./spring-rest/target/spring-rest-1.0-SNAPSHOT", "/"));
       // server.addHandler(new WebAppContext("spring-rest/src/main/webapp", "/"));

        server.start();

        return server ;
    }
}
