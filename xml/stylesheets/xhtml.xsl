<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:d="https://dsg.northeastern.edu/dailp/ns/1.0"
    xpath-default-namespace="http://www.tei-c.org/ns/1.0" xmlns="http://www.w3.org/1999/xhtml">
    <xsl:template match="/">
        <html>
            <xsl:apply-templates/>
        </html>
    </xsl:template>
    <xsl:template match="TEI">
        <!-- <xsl:text disable-output-escaping="yes">&#10;&lt;!DOCTYPE html&gt;&#10;</xsl:text>-->
        <head>
            <title>DAILP Document Viewer</title>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <!--  integrity="sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I" crossorigin="anonymous" -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css"/>
        </head>
        <body>
            <xsl:apply-templates/>
            <!-- integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous" -->
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
            <!-- integrity="sha384-oesi62hOLfzrys4LxRF63OJCXdXDipiYWBnvTl9Y9/TRlw5xlKIEHpNyvvDShgf/" crossorigin="anonymous" -->
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js"></script>
        </body>
    </xsl:template>
    <xsl:template match="teiHeader"/>
    <!-- TODO: text -->
    <xsl:template match="group">
        <div id="doc_interface">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    <xsl:template match="group/text">
        <div class="doc_layer" id="{@type}"><xsl:apply-templates/></div>
    </xsl:template>
    <xsl:template match="body">
        <div class="doc_container">
            <!-- Is there a more elegant handling of this? -->
            <xsl:choose>
                <xsl:when test="exists(child::pb)">
                    <xsl:apply-templates select="pb"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates/>
                </xsl:otherwise>
            </xsl:choose>

        </div>
    </xsl:template>
    <!-- This allows the output tree to encapsulate pages for pagination -->
    <xsl:template match="pb">
        <div class="doc_page">
            <xsl:apply-templates select="following-sibling::ab"/>
        </div>
    </xsl:template>
    <xsl:template match="ab">
        <p>
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    <xsl:template match="lb">
        <br id="{@n}"/>
    </xsl:template>
    <xsl:template match="ab/seg">
        <span class="idea_unit" id="{@xml:id}">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    <xsl:template match="w">
        <span class="word row" id="{@xml:id}">
            <xsl:choose>            
            <xsl:when test="child::text()">
                <span class="col-md">
                    <xsl:apply-templates/>
                </span>
            </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates/>
                </xsl:otherwise>
            </xsl:choose>
        </span>
    </xsl:template>
    <xsl:template match="choice">
        <span class="igt col-md">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    <xsl:template match="orig">
        <span class="orig row" lang="chr-Cher">
            <span class="col-md">
                <xsl:apply-templates/>
            </span>
        </span>
    </xsl:template>
    <xsl:template match="reg">
        <span class="reg row" lang="chr-Cher">
            <span class="col-md">
                <xsl:apply-templates/>
            </span>
        </span>
    </xsl:template>
    <xsl:template match="choice/seg">
        <span class="{@type} row">
            <span class="col-md">
                <xsl:apply-templates/>
            </span>
        </span>
    </xsl:template>
    <!-- TODO: gap -->
    <xsl:template match="standOff">
        <div class="standoff">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    <xsl:template match="d:noteBlock">
        <div class="noteBlock">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    <xsl:template match="note">
        <span class="note" id="{@target}" lang="en">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
</xsl:stylesheet>
