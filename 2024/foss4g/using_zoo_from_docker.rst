.. _using_zoo_from_docker:

Installation, configuration and ZOO-Kernel use
=====================================================

.. contents:: Table of Contents
    :depth: 5
    :backlinks: top

ZOO-Project Installation
------------------------

As said in introduction, you will use the the ZOO-Project Docker
Compose evironment using the official `ZOO-Project Docker Image
<https://hub.docker.com/r/zooproject/zoo-project>`__. To install the
ZOO-Project with the workshop2024 specific data and configuration
files on your local machine, use the following commands.

.. code-block:: guess
    
    git clone https://github.com/ZOO-Project/ZOO-Project.git
    cd ZOO-Project
    curl -o docker-compose.yml https://raw.githubusercontent.com/ZOO-Project/workshops/master/2024/foss4g/files/sample-docker-compose.yml
    curl -o zoows2024.tar.bz2 https://www.geolabs.fr/dl/zoows2024g.tar.bz2
    tar -xvf zoows2024.tar.bz2
    curl -o docker/main.cfg https://raw.githubusercontent.com/ZOO-Project/workshops/master/2024/foss4g/files/main.cfg
    docker-compose up -d

.. warning:: The following ports should be available on the host where
	  you run the previous command: 80 and 8888.

ZOO-Project Configuration
---------------------------------------------------

General ZOO-Kernel settings are set in the ``main.cfg`` file located in the same directory as the ZOO-Kernel, so in ``/usr/lib/cgi-bin/``. This informations will be accessible from each services at runtime, so when you wil use Execute requests. You can see a typical ``main.cfg`` content in the following:

.. note:: we will use ZOO-Kernel or ``zoo_loader.cgi`` script without any distinction 
    in this document.

.. literalinclude:: files/main.cfg
    :linenos:


The ``main.cfg`` file contains metadata informations about the identification and provider but also some important settings. The file is composed of various sections, namely ``[main]``, ``[identification]`` and ``[provider]`` per default. 

From the ``[main]`` section, settings are as follow:
 * ``lang``: the supported languages separated by a coma (the first is the default one),
 * ``version``: the supported WPS version,
 * ``encoding``: the default encoding of WPS Responses,
 * ``serverAddress``: the url to access your ZOO-Kernel instance,
 * ``dataPath``: the path to store data files (when MapServer support was activated, 
   this directory is used to store mapfiles and data).
 * ``tmpPath``: the path to store temporary files (such as ExecuteResponse when 
   storeExecuteResponse was set to true),
 * ``tmpUrl``: a url relative to ``serverAddress`` to access the temporary file,
 * ``cacheDir``: the path to store cached request files [#f1]_ (optional),
 * ``mapservAddress``: your local MapServer address (optional),
 * ``msOgcVersion``: the version for all supported OGC Web Services output [#f2]_
   (optional),
 * ``cors``: accept cross reference,
 * ``memory``: this parameter define how the ZOO-Kernel will handle
   the inputs (set to ``load`` in case you want everything to be
   loaded in memory and ensure to get a ``value`` field set ).
 * ``msConfig``: this parameter define where the MapServer 8.0 configuration file
   is located.

.. warning:: Please make sure that ``memory`` is set to ``load`` for
	     the JavaScript services you will create in the last section. 

The ``[identification]`` and ``[provider]`` section are specific to OGC metadata and
should be set [#f3]_.

Obviously, you are free to add new sections to this file if you need
more [#f8]_. Nevertheless, you have to know 
that there is some specific names you should use only for specific
purposes: ``[headers]``, ``[mapserver]``, ``[env]``, ``[lenv]``, ``[renv]`` and ``[senv]``.

.. warning:: ``[senv]``, ``[renv]`` and ``[lenv]`` are used / produced
	     on runtime internaly by the ZOO-Kernel and should be
	     accessed / defined only from the Service code.

The ``headers`` section is used to define your own HTTP Response
headers. You may take a look at headers returned by web site such as 
http://www.zoo-project.org by using curl command line tool for
instance and notice the specific heder ``X-Powered-By: Zoo-Project@Trac``.

.. warning:: There is no reason to define basic headers such as
    ``Content-Type`` or ``encoding`` as they will be overwritten at runtime by the
    ZOO-Kernel.

The ``mapserver`` section is used to store specific mapserver configuration 
parameters such as `PROJ_LIB` and `GDAL_DATA` or any other you want to be set to 
make your MapServer working.

.. note:: the ``mapserver`` section is mainly used on WIN32 platform


The ``env`` section is used to store specific environment variables you want to be set 
prior to load your Services Provider and run your Service. A typical example, is when your
Service requires to access to a X server running on framebuffer, then you will have to 
set the ``DISPLAY`` environnement variable, in this case you would add 
``DISPLAY=:1`` line in your ``[env]`` section.

The ``lenv`` is used to store runtime informations automatically set by the 
ZOO-Kernel before running your service and can be accesses / updated from it:
 * ``sid`` (r): the service unique identifier, 
 * ``status`` (rw): the current progress value (value between 0 and 100, percent),
 * ``cwd`` (r): the current working directory of the ZOO-Kernel,
 * ``message`` (rw): an error message when returning ``SERVICE_FAILED`` (optional),
 * ``cookie`` (rw): the cookie your service want to return to the client (for authentication
   purpose or tracking).

The ``senv`` is used to store session informations on the server
side. You can then access them automatically from service if the
server is requested using a valid cookie (as defined in ``lenv >
cookie``). The ZOO-Kernel will store on disk the values set in the
``senv`` maps, then load it and dynamically add its content to the one
available in the ``main.cfg``. The ``senv`` section should contain at
least:
 * ``XXX``: the session unique identifier where ``XXX`` is the name included in the 
    returned cookie.

.. _cookie_example:

For instance, if you get the following in your Service source code [#f4]_ :

.. code-block:: python
    
    conf["lenv"]["cookie"]="XXX=XXX1000000; path=/" 
    conf["senv"]={"XXX": "XXX1000000","login": "demoUser"}

That means that the ZOO-Kernel will create a file ``sess_XXX1000000.cfg`` in the 
``cacheDir`` and return the specified cookie to the client. Each time the client will 
request the ZOO-Kernel using the Cookie, it will automatically load the value stored 
before running your service. You can then easilly access this informations from your 
service source code. This functionality won't be used in the following presentation.

Specific OGC API - Processes configuration file
-----------------------------------------------

In addition to the tranditional ``main.cfg`` file for global
configuration and settings, the ZOO-Project now requires a new
configuration  file to support the OGC API - Processes - Part 1:
Core specification. This file is named ``oas.cfg`` and is located in 
the same directory as the main configuration file you get introcuded
to previously.

You can access the `dedcated section
<https://zoo-project.github.io/docs/kernel/configuration.html#openapi-specification-configuration-file>`__
from the official documentation to see how the endpoints from the
exposed API are configured. 

To have the ZOO-Project being conformant with Conformance Class HTML,
you have to edit the ``oas.cfg`` file located in the docker
subdirectory you have downloaded when cloning the ZOO-Project GitHub
repository. Once, you edit the oas.cfg to set the
``full_html_support`` to true, depending on your operating system, you
may have to restart the docker-compose environment.

.. code-block:: python
    
    docker-compose down && docket-compose up -d


Accessing OGC API - Processes
---------------------------------------------------

You can access your local `OGC API - Processes - Part 1: Core
<https://ogcapi.ogc.org/processes/>`__ Server Instance by opening your
favotire browser and loading `Swagger-UI
<https://swagger.io/tools/swagger-ui/>`__ from the following URL:
`http://localhost/ogc-api/api.html 
<http://localhost/ogc-api/api.html>`__.

.. image:: ./images/oapip-swagger-ui.png
   :width: 450px
   :align: center

You can also access the Basic HTML UI provided by the ZOO-Project by
accessing the following URL: `http://localhost/ogc-api/index.html
<http://localhost/ogc-api/index.html>`__.

.. image:: ./images/oapip-basic-landingPage.png
   :width: 850px
   :align: center


.. rubric:: Footnotes

.. [#f1] when you use GET requests passed through ``xlink:href`` the ZOO-Kernel will
    execute the request only once, the first time you will ask for this ressource and it will
    store on disk the result. The next time you will need the same feature, the cached file
    will be used which make your process running faster. If ``cachedir`` was not 
    specified in the ``main.cfg`` then ``tmpPath`` value will be used.
.. [#f2] since version 1.3.0, when MapServer is activated, your service can automatically 
    return a WMS, WFS or WCS request to expose your data. Your can set here the specific
    version number you want to use to request your local MapServer setup. It depends 
    mostly on the client capability to deal with specific OGC Web Services version.
.. [#f3] since version 1.3.0, when MapServer is activated, the same metadata will be used
    for setting metadata for OGC Web Services.
.. [#f8] you can take a quick look into the mapmint ``main.cfg`` file
    which is available in `/usr/lib/cgi-bin/mm/` directory to have
    example of sections use.
.. [#f4] If you're not familiar with ZOO-Project, you can `pass <using_zoo_from_osgeolivevm#testing-the-zoo-installation-with-getcapabilities>`__  this part and come to it after the next section.
.. [#f9] sub-directories listing is available from `revision 469 <http://zoo-project.org/trac/changeset/469>`__.
