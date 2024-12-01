.. _first_service:

Creating your first ZOO-Service
========================================

.. contents:: Table of Contents
    :depth: 5
    :backlinks: top

Introduction
-----------------------------------------------------

In this secion, you will create and publish a simple ZOO-Service named
``Hello`` which will simply return a hello message containing the
input value provided. It will be usefull to present in deeper details
general concept on how ZOO-Kernel works and handles execution
requests.

Service and publication process overview
-----------------------------------------------------

Before starting developing a ZOO Service, you should remember that in 
ZOO-Project, a Service is a couple made of:

 * a metadata file: a ZOO Service Configuration File (ZCFG) containing metadata 
   informations about a Service (providing informations about default / supported 
   inputs and outputs for a Service)
 * a Services Provider: it depends on the programming language used, but for Python it
   is a module and for JavaScript a script file.

To publish your Service, which means make your ZOO Kernel aware of its presence,
you should copy a ZCFG file in the directory where ``zoo_loader.cgi``
is located (in this workshop, ``/usr/lib/cgi-bin``) or in any
subdirectory.

.. warning:: only the ZCFG file is required  for the Service to be considerate as 
    available. So if you don't get the Service Provider, obviously your Execute 
    request will fail as we will discuss later.

Before publication, you should store your ongoing work, so you'll start by 
creating a directory to store the files of your Services Provider:

.. code-block:: none
    
    mkdir -p docker/ws2024_sp

Once the ZCFG and the Python module are both ready, you can publish simply
by copying the corresponding files in the same directory as the ZOO-Kernel.

Creating your first ZCFG file
-----------------------------------------------------

You will start by creating the ZCFG file for the ``Hello`` Service. Edit the 
``docker/ws2024_sp/Hello.zcfg`` file 
and add the following content:

.. code-block:: none
    
    [Hello]
     Title = Return a hello message.
     Abstract = Create a welcome string.
     processVersion = 2
     storeSupported = true
     statusSupported = true
     serviceProvider = test_service
     serviceType = Python
     <DataInputs>
      [name]
       Title = Input string
       Abstract = The string to insert in the hello message.
       minOccurs = 1
       maxOccurs = 1
       <LiteralData>
           dataType = string
           <Default />
       </LiteralData>
     </DataInputs>
     <DataOutputs>
      [Result]
       Title = The resulting string
       Abstract = The hello message containing the input string
       <LiteralData>
           dataType = string
           <Default />
       </LiteralData>
     </DataOutputs>

.. note:: the name of the ZCFG file and the name between braket (here ``[Hello]``) 
    should be the same and correspond to the function name you will define in your 
    Services provider.

As you can see in the ZOO Service Configuration File presented above it is divided into
three distinct sections:
  #. Main Metadata information (from line 2 to 8)
  #. List of Inputs metadata information (from 9 line to 19)
  #. List of Outputs metadata information (from line 20 to 28)

You can get more informations about ZCFG from `the reference documentation 
<http://zoo-project.org/docs/services/zcfg-reference.html>`__.

If you copy the ``Hello.zcfg`` file in a sub-directory (``ws2024``) of
your ZOO Kernel  then, you will be able to request for DescribeProcess
using the ``ws2024.Hello``  Identifier. The ``ws2024.Hello``
service should also be listed from Capabilities document.

.. code-block:: none
    
    cp docker/ws2024_sp/Hello.zcfg docker/ws2024

Test requests
-----------------------------------------------------

In this section you will tests each WPS requests : GetCapabilities, 
DescribeProcess and Execute. Note that only GetCapabilities and DescribeProcess
should work at this step.

Test accessing the processes list
.......................................................

To access the processes list, you can use the following endpoint:
`/processes <http://localhost/ogc-api/processes>`__.

Now, you should find your `ws2024.Hello`processes listed as shown bellow.

.. image:: ./images/oapip-processes-list-hello.png
   :width: 450px
   :align: center

You can also directly use the following URL:
`/processes.html <http://localhost/ogc-api/processes.html>`__ to
search for your service, as illustrated bellow.

.. image:: ./images/oapip-processes-list-hello-search-html.png
   :width: 450px
   :align: center

Test accessing the detailled description of the process
.......................................................

To access the detailled description of the ws2024.Hello process, you
can use the following endpoint: `/processes/ws2024.Hello 
<http://localhost/ogc-api/processes/ws2024.Hello>`__.

.. image:: ./images/oapip-processes-description-hello-json.png
   :width: 450px
   :align: center

To access the HTML form giving you the capability to generate an
execute request based on the description of the ws2024.Hello process, you
can use the following URL: `/processes/ws2024.Hello.html 
<http://localhost/ogc-api/processes/ws2024.Hello.html>`__.

.. image:: ./images/oapip-processes-description-hello-html.png
   :width: 450px
   :align: center


Test to Execute the process
.......................................................

Obviously, you cannot run your Service because the Python file was not published
yet. If you try the following ``Execute`` request from the Basic HTML
UI, you should get the same result as illutrated bellow.

.. literalinclude:: files/ws2024_Hello.json

.. image:: ./images/oapip-processes-execute-hello-html-not-found.png
   :width: 850px
   :align: center


Implementing the Python Service
-----------------------------------------------------

General Principles
.......................................................

The most important thing you must know when implementing a new ZOO-Services 
using the Python language is that the function corresponding to your Service 
returns an integer value representing the status of execution 
(``SERVICE_FAILED`` [#f1]_ or ``SERVICE_SUCCEEDED`` [#f2]_) and takes three 
arguments (`Python dictionaries
<http://docs.python.org/tutorial/datastructures.html#dictionaries>`__): 

  -  ``conf`` : the main environment configuration (corresponding to the main.cfg content) 
  - ``inputs`` : the requested / default inputs (used to access input values)
  - ``outputs`` : the requested / default outputs (used to store computation result)

.. note:: when your service return ``SERVICE_FAILED`` you can set 
    ``conf["lenv"]["message"]`` to add a personalized message in the ExceptionReport 
    returned by the ZOO Kernel in such case.

You can find bellow the first 3 sections of the `main.cfg` (seen
`before <using_zoo_from_docker.html#zoo-kernel-configuration>`__)
file stored in a ``conf`` variable as a Python dictionnary.

.. literalinclude:: files/main_map.json
    :linenos:

In the following you get a sample outputs value passed to a Python or a JavaScript Service:

.. code-block:: javascript
    :linenos:    

    {
      'Result': {
        'dataType': 'string', 
	'inRequest': 'true'
      }
    }

.. note:: the ``inRequest`` value is set internally by the ZOO-Kernel and can be    used to determine from the Service if the key was provided in the request.

ZOO-Project provide a ZOO-API which was originally only available for
JavaScript services, but thanks to the work of the ZOO-Project
community, now you have also access to a ZOO-API when using
the Python language. Thanks to the Python ZOO-API you don't have to remember anymore
the value of SERVICE_SUCCEDED and SERVICE_FAILED, you
have the capability to translate any string from your Python service
by calling the ``_`` function (ie: ``zoo._('My string to
translate')``) or to update the current status of a running service by
using the ``update_status`` [#f4]_ function the same way you use it from
JavaScript or C services.

The Hello Service
.......................................................

You can copy and paste the following into the 
``docker/ws2024_sp/test_service.py`` file.

.. literalinclude:: ./files/test_service.py

Once you finish editing the file, you should copy it in the ``ws2024`` directory: 

.. code-block:: none
    
    cp docker/ws2024_sp/test_service.py docker/ws2024


If you try to run the previous request again from the HTML Basic UI,
you should get a result similar to what is presented bellow.


.. image:: ./images/oapip-processes-execute-hello-html-value.png
   :width: 850px
   :align: center


Conclusion
-----------------------------------------------------

Even if this first service was really simple it was useful to illustrate how the 
ZOO-Kernel fill ``conf``, ``inputs`` and ``outputs`` parameter prior to load 
and run your function service, how to write a ZCFG file, how to publish a Services 
Provider by placing the ZCFG and Python files in the same directory as the 
ZOO-Kernel, then how to interract with your service using both 
``GetCapabilities``, ``DescribeProcess`` and ``Execute`` requests. We will see 
in the `next section <building_blocks_presentation.html>`__ how to write similar requests 
using the XML syntax.

.. rubric:: Footnotes

.. [#f1] ``SERVICE_FAILED=4``
.. [#f2] ``SERVICE_SUCCEEDED=3``
.. [#f4] sample use of update_status is available `here <http://zoo-project.org/trac/browser/trunk/zoo-project/zoo-services/utils/status/cgi-env/service.py#L1>`_
.. [#f3]  To get on-going status url in ``statusLocation``, you'll
    need to setup the `utils/status
    <http://www.zoo-project.org/trac/browser/trunk/zoo-project/zoo-services/utils/status>`_
    Service. If you don't get this service available, the ZOO-Kernel will
    simply give the url to a flat XML file stored on the server which will
    contain, at the end of the execution, the result of the Service
    execution. For more informations please take a look into the
    reference  `documentation <http://zoo-project.org/docs/services/status.html>`__.
