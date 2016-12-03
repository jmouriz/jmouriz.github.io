#!/usr/bin/perl
use strict;
use warnings;

use File::Temp qw/tempfile/;
use File::Copy;

my $path = (shift or die "Por favor, especifique la ruta de temas\n");

opendir my $handler, $path or die "Error al abrir la ruta $path: $!\n";

while (readdir $handler) {
   next if not /\.css$/;
   my $input = "$path/$_";
   my $output = tempfile();
   open INPUT, $input or die "Error al abrir el archivo $input: $!\n";
   open OUTPUT, ">$output" or die "Error al abrir el archivo $output $!\n";
   while (<INPUT>) {
      s/\.w3-theme-([ld][1-5])/.w3-theme-$1, .w3-hover-theme-$1:hover/;
      print OUTPUT;
   }
   close INPUT;
   close OUTPUT;
   move($output, $input);
}
closedir $handler;
