.. _ogr_base_vect_ops:

Building blocks presentation
==========================================================================

.. contents:: Table of Contents
    :depth: 5
    :backlinks: top

Introduction
---------------------------------------------------

In this section, you will use the basic ZOO-Services : ``Buffer``, 
``Intersection`` and ``Difference`` which use OGR and psycopg Python
modules by using a User Interface using the ZOO-Client to invoke WPS
requests.
The intended goal of this section is to present and interact with your
new building blocks before chaining them in the next section.

As seen earlier, once you have setup the ZOO-Project, you have
multiple demonstration UI available from `http://localhost
<http//localhost/>`__. 

Services Provider and configuration files
---------------------------------------------------

First you may verify if the ZOO-Services are available from your current setup.
You can take a look at the ``Buffer.zcfg``, ``Intersection.zcfg`` and 
``Difference.zcfg`` to get details about parameters.
As you can see from the ZCFG files, you will use ZOO-Services provided by the 
``ogr_service.zo`` C service provider. So if you want to modify the Python code
you will have to edit the corresponding file (so ``service.py``). 
You are invited to use similar requests as the one used in previous
sections to learn about each services individually.

The Buffer Service
---------------------------------------------------

First click on a street then once the street is displayed in blue, click the 
'Buffer' button on top, you should get similar result as displayed in the following.

.. image:: ./images/Buffer_Level_15.png
   :width: 650px
   :align: center

The Intersection Service
---------------------------------------------------

Using the same client interface as before, once you get a Buffer, you can then 
select a street intersecting the Buffer geometry to compute intersection by clicking on the Intersection button.

    
.. image:: ./images/Intersection_Level_15.png
   :width: 650px
   :align: center


The Difference Service
---------------------------------------------------

Using the same instructions as for Intersetion, you can get the following result.

.. image:: ./images/Difference_Level_15.png
   :width: 650px
   :align: center


Buffer service ZCFG tweeks
---------------------------------------------------

You will edit the file: ``/usr/lib/cgi-bin/Buffer.zcfg`` and add the
block below in the ``Result`` from the ``DataOutputs`` block.
 
.. code-block:: guess
    
    <Supported>
     mimeType = image/png
     useMapServer = true
     extension = json
    </Supported>

The ``mimeType`` is defined as ``image/png`` and there is a new
optional parameter: ``useMapServer``. It makes you able to inform
the ZOO-Kernel that it has to use MapServer to publish the result the
service returned as WMS / WFS or WCS (this last won't be used in this
workshop) rather than simply storing the result as a file, in case you
ask it to do so, using ``@Reference=true`` for output.
    
Note that you also can define ``msStyle`` which let you define your
own MapServer ``STYLE`` block definition.

When you need to access a result many time or for different purpose
accross other services then it is really useful to ask ZOO-Kernel to
publish your result as WMS, WFS or WCS.

Note that no modification of the code of the ``Buffer`` service was
required to handle automatic pubilcation of the result as it is a
vector format supported by OGR, only modification of the zcfg was
required.

For more informations about the MapServer support, please refer to `the
official  ZOO-Project Documentation <http://zoo-project.org/docs/kernel/mapserver.html>`_.

Conclusion
---------------------------------------------------

Now you know this three services, and you get a simple interface to interact 
with your MapServer WFS and your ZOO-Project WPS Servers, you are ready to use 
the Services in a different way, by chaining them using the JavaScript ZOO-API to build 
more complexe and powerfull services.
