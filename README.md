#Visual Mets
The Visual Mets application renders Mets documents into a visual display.
It comes with a tool which converts csv into Mets documents.

##Build
To build the project, clone the sources and build using:

<code>$ mvn clean package</code>

This will produce a war and jar.

Or download the latest stable build from:

https://bamboo.socialhistoryservices.org/browse/VMETS

##Minimum setup
* Install a tomcat6\7 or jetty server
* Install your METS war file on the server.

##Configuration
* copy the pid.properties file onto a different part of your server. For example to:
<code>/etc/tomcat6/visualmets.properties</code>
* Change it's properties according to your custom setup of the MongoDB replicaset and proxy URL
* Declare the visualmets.properties file in the setup.sh. For example :
<code>JAVA_OPTS="$JAVA_OPTS -Dvisualmets=/etc/tomcat6/visualmets.properties"</code>
* Reserve a temporary folder for caching purposes. Your server ought to be able to read and write to it. it will store images and XML. Mention the code
in your property file
<code>external.cacheFolder = /mnt/visualmets/</code>

##Location of Mets documents
Your Mets ought to have fileSec with references to images. Store these on a fileserver that is accessible over
the internet. Make sure the domain names where the resources are on, is mentioned in the security property. For example as:
<code>external.trusted = ^.*.mydomain.net$,^.*.otherdomain.org$</code>

##Create METS documents
Please read the instructions in the metsmaker module