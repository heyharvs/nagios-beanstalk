# nagios-beanstalk
A simple node binary to check beanstalk health.  Why build this when you have CloudWatch you ask?  Because Nagios!

Please note that when running those on the NRPE server that node has to be installed globally.  If you use nvm, you're going
to run into issues with nrpe firing up the binary.  It must be in /usr/bin/node.
