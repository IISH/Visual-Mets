#Visual Mets - metsmaker

The metsmaker is used to produce mets.

##Description
Metsmaker will search for *.txt files in the input directory given as a parameter by the user. It will output METS XML files in the output directory, also given as a parameter by the user.
Tocmaker will produce mets about mets, suitable for a table of content

##Usage metsmaker
The following parameters are mandatory for Metsmaker to run:

* inputFolder : The directory containing the text files that need to be converted.
* outputFolder : The directory where output XML files will be saved. This directory has to be created beforehand.

These parameters are optional:
* objId This parameter will set the objId string in the METS header.
* baseUrl This parameter will set the url that precedes every file, image or thumbnail location.

Examples:

    java -jar metsmaker-1.0.jar -inputFolder "C:\projects\testinput" -outputFolder "C:\projects\testoutput" -baseUrl "http://www.example.org/"
    java -jar metsmaker-1.0.jar -objId 123456789 -inputFolder "C:\projects\testinput" -outputFolder "C:\projects\testoutput" -baseUrl "http://www.example.org/"
    java -jar c:\projects\visualmets\metsmaker\target\metsmaker-1.0.jar -objId ziegler4733 -inputFolder "C:\inputfiles\input" -outputFolder "C:\outputfiles\output" -baseUrl "http://example.org/project/4733/"

###Input data format
The input data has to be a csv file, with a semicolon ( as a separator. It has to be formatted according to the following column names:

- Identifier (persistent)
- Collection code
- Master tiff image (directory: archival)
- JPG derivative image (directory: reference)
- Order
- JPG thumbnail image (directory: thumbnail)
- Plain text based transcription (dir: transcription)

Example:

    "10122/7407741b-3762-4726-a89d-fac32552cf4c";"russel_001";"Russel_001_0001.tif";"Russel_001_0001.jpg" ;1;"Russel_001_0001_thumbnail.jpg";"transcription.txt"

##Tocmaker
It will create a METS XML file. This is a representation of your archive or collection, and will describe the hierarchy of the METS documents and the location of the thumbnail files that represent the different METS documents. It will be used to generate the tree in the full version of Visual Mets.

###Running instructions
The following parameters are mandatory for Tocmaker to run:
* inputFile The directory containing the text files that need to be converted.
* outputFile The directory where output XML files will be saved. This directory has to be created beforehand.

Examples:

    java -jar tocmaker-1.0.jar -inputFile "C:\inputfile.csv" -outputFile "C:\outputfile.xml"

###Input data format
The input data has to be a csv file, with a semicolon as a separator. It has to be formatted according to the following specification:

* Filename of XML file
* Title of XML file
* Filename of thumbnail
* Level 1 in hierarchy according to your archival document
* Level 2 in hierarchy according to your archival document
* Level 3 in hierarchy according to your archival document
* Level 4 in hierarchy according to your archival document
* Level 5 in hierarchy according to your archival document

Example:

    http://example.org/project/4698/xml/4698_0.xml;Project 4698;http://example.org/project/4698/archival/OWL2010-01-L77A-4698-0001.jpg;level1;;;;
    http://example.org/project/4705/xml/4705_0.xml;Project 4705;http://example.org/project/4705/archival/OWL2010-L77A-01-0000000002_001.jpg;level1;;;;
    http://example.org/project/4716/xml/4716_0.xml;Project 4716;http://example.org/project/4716/archival/OWL2010-01-L77A-4716-0001.jpg;level1;level2;;;
    http://example.org/project/4717/xml/4717_0.xml;Project 4717;http://example.org/project/4717/archival/OWL2010-01-L77A-4717-0001.jpg;level1;level2;level3;;

