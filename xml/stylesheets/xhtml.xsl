<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:d="https://dsg.northeastern.edu/dailp/ns/1.0"
xpath-default-namespace="http://www.tei-c.org/ns/1.0"
xmlns="http://www.w3.org/1999/xhtml">
    <xsl:template match="/">
        <html>
            <xsl:apply-templates />
        </html>
    </xsl:template>
    <xsl:template match="TEI">
        <!-- <xsl:text disable-output-escaping="yes">&#10;&lt;!DOCTYPE html&gt;&#10;</xsl:text>-->
        <head>
            <title>DAILP Document Viewer</title>
            <link rel="stylesheet" href="style.css" />
        </head>
        <body>
            <nav class="page-header">
                <a href="/" class="page-header-link">Cherokee
                Reader (XSLT Version)</a>
            </nav>
            <xsl:apply-templates />
        </body>
    </xsl:template>
    <xsl:template match="teiHeader">
        <header>
            <h1>
                <xsl:value-of select="fileDesc/titleStmt/title" />
            </h1>
            <h2>
                <xsl:value-of select="fileDesc/sourceDesc/p" />
            </h2>
        </header>
    </xsl:template>
    <!-- TODO: text -->
    <xsl:template match="group">
        <main id="doc-interface">
            <xsl:apply-templates />
        </main>
    </xsl:template>
    <xsl:template match="group/text">
        <section class="doc-layer" id="{@type}">
            <xsl:apply-templates />
        </section>
    </xsl:template>
    <xsl:template match="body">
        <div class="doc-container">
            <!-- Is there a more elegant handling of this? -->
            <xsl:choose>
                <xsl:when test="exists(child::pb)">
                    <xsl:apply-templates select="pb" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates />
                </xsl:otherwise>
            </xsl:choose>
        </div>
    </xsl:template>
    <!-- This allows the output tree to encapsulate pages for pagination -->
    <xsl:template match="pb">
        <div class="doc-page">
            <xsl:apply-templates select="following-sibling::ab" />
        </div>
    </xsl:template>
    <xsl:template match="ab">
        <p>
            <xsl:apply-templates />
        </p>
    </xsl:template>
    <xsl:template match="lb">
        <!-- <br id="line-break-{@n}"/> -->
    </xsl:template>
    <xsl:template match="ab/seg">
        <div class="idea-unit" id="{@xml:id}">
            <xsl:apply-templates />
        </div>
    </xsl:template>
    <xsl:template match="w">
        <div class="word" id="{@xml:id}">
            <xsl:apply-templates />
        </div>
    </xsl:template>
    <xsl:template match="choice">
        <div class="igt">
            <xsl:apply-templates />
        </div>
    </xsl:template>
    <xsl:template match="orig">
        <div class="orig" lang="chr">
            <xsl:apply-templates />
        </div>
    </xsl:template>
    <xsl:template match="reg">
        <div class="reg">
            <xsl:apply-templates />
        </div>
    </xsl:template>
    <xsl:template match="choice/seg[@type='phonemic_form']" />
    <xsl:template match="choice/seg[@type!='phonemic_form']">
        <div class="{@type}">
            <xsl:apply-templates />
        </div>
    </xsl:template>
    <!-- TODO: gap -->
    <xsl:template match="standOff">
        <div class="standoff">
            <xsl:apply-templates />
        </div>
    </xsl:template>
    <xsl:template match="d:noteBlock">
        <div class="note-block">
            <xsl:apply-templates />
        </div>
    </xsl:template>
    <xsl:template match="note">
        <div class="note" id="{@target}">
            <xsl:apply-templates />
        </div>
    </xsl:template>
</xsl:stylesheet>
