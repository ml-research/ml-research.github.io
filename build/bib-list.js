/*!*
 * Javascript BibTex Parser v0.1
 * Copyright (c) 2008 Simon Fraser University
 * @author Steve Hannah <shannah at sfu dot ca>
 *
 *
 * License:
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Credits:
 *
 * This library is a port of the PEAR Structures_BibTex parser written
 * in PHP (http://pear.php.net/package/Structures_BibTex).
 *
 * In order to make porting the parser into javascript easier, I have made
 * use of many phpjs functions, which are distributed here under the MIT License:
 *
 *
 * More info at: http://kevin.vanzonneveld.net/techblog/category/php2js
 *
 * php.js is copyright 2008 Kevin van Zonneveld.
 *
 * Portions copyright Ates Goral (http://magnetiq.com), Legaev Andrey,
 * _argos, Jonas Raoni Soares Silva (http://www.jsfromhell.com),
 * Webtoolkit.info (http://www.webtoolkit.info/), Carlos R. L. Rodrigues, Ash
 * Searle (http://hexmen.com/blog/), Tyler Akins (http://rumkin.com), mdsjack
 * (http://www.mdsjack.bo.it), Alexander Ermolaev
 * (http://snippets.dzone.com/user/AlexanderErmolaev), Andrea Giammarchi
 * (http://webreflection.blogspot.com), Bayron Guevara, Cord, David, Karol
 * Kowalski, Leslie Hoare, Lincoln Ramsay, Mick@el, Nick Callen, Peter-Paul
 * Koch (http://www.quirksmode.org/js/beat.html), Philippe Baumann, Steve
 * Clay, booeyOH
 *
 * Licensed under the MIT (MIT-LICENSE.txt) license.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL KEVIN VAN ZONNEVELD BE LIABLE FOR ANY CLAIM, DAMAGES
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 * Synopsis:
 * ----------
 *
 * This class provides the following functionality:
 *    1. Parse BibTex into a logical data javascript data structure.
 *    2. Output parsed BibTex entries as HTML, RTF, or BibTex.
 *
 *
 * The following usage instructions have been copyed and adapted from the PHP instructions located
 * at http://pear.php.net/manual/en/package.structures.structures-bibtex.intro.php
 * Introduction
 * --------------
 * Overview
 * ----------
 * This package provides methods to access information stored in a BibTex
 * file. During parsing it is possible to let the data be validated. In
 * addition. the creation of BibTex Strings as well as RTF Strings is also
 * supported. A few examples
 *
 * Example 1. Loading a BibTex File and printing the parsed array
 * <script src="BibTex.js"></script>
 * <script>
 * bibtex = new BibTex();
 * bibtex.content = content; // the bibtex content as a string
 *
 * bibtex->parse();
 * alert(print_r($bibtex->data,true));
 * </script>
 *
 *
 * Options
 * --------
 * Options can be set either in the constructor or with the method
 * setOption(). When setting in the constructor the options are given in an
 * associative array. The options are:
 *
 * 	-	stripDelimiter (default: true) Stripping the delimiter surrounding the entries.
 * 	-	validate (default: true) Validation while parsing.
 * 	-	unwrap (default: false) Unwrapping entries while parsing.
 * 	-	wordWrapWidth (default: false) If set to a number higher one
 * 	    that the entries are wrapped after that amount of characters.
 * 	-	wordWrapBreak (default: \n) String used to break the line (attached to the line).
 * 	-	wordWrapCut (default: 0) If set to zero the line will we
 * 	    wrapped at the next possible space, if set to one the line will be
 * 	    wrapped exactly after the given amount of characters.
 * 	-	removeCurlyBraces (default: false) If set to true Curly Braces will be removed.
 *
 * Example of setting options in the constructor:
 *
 * Example 2. Setting options in the constructor
 * bibtex = new BibTex({'validate':false, 'unwrap':true});
 *
 *
 * Example of setting options using the method setOption():
 *
 * Example 62-3. Setting options using setOption
 * bibtex = new BibTex();
 * bibtex.setOption('validate', false);
 * bibtex.setOption('unwrap', true);
 *
 * Stored Data
 * ------------
 * The data is stored in the class variable data. This is a a list where
 * each entry is a hash table representing one bibtex-entry. The keys of
 * the hash table correspond to the keys used in bibtex and the values are
 * the corresponding values. Some of these keys are:
 *
 * 	-	cite - The key used in a LaTeX source to do the citing.
 * 	-	entryType - The type of the entry, like techreport, book and so on.
 * 	-	author - One or more authors of the entry. This entry is also a
 * 	    list with hash tables representing the authors as entries. The
 * 	    author has table is explained later.
 * 	-	title - Title of the entry.
 *
 * Author
 * ------
 * As described before the authors are stored in a list. Every entry
 * representing one author as a has table. The hash table consits of four
 * keys: first, von, last and jr. The keys are explained in the following
 * list:
 *
 * 	-	first - The first name of the author.
 * 	-	von - Some names have a 'von' part in their name. This is usually a sign of nobleness.
 * 	-	last - The last name of the author.
 * 	-	jr - Sometimes a author is the son of his father and has the
 * 	    same name, then the value would be jr. The same is true for the
 * 	    value sen but vice versa.
 *
 * Adding an entry
 * ----------------
 * To add an entry simply create a hash table with the needed keys and
 * values and call the method addEntry().
 * Example 4. Adding an entry
 * bibtex                         = new BibTex();
 * var addarray                   = {};
 * addarray['entryType']          = 'Article';
 * addarray['cite']               = 'art2';
 * addarray['title']              = 'Titel of the Article';
 * addarray['author'] = [];
 * addarray['author'][0]['first'] = 'John';
 * addarray['author'][0]['last']  = 'Doe';
 * addarray['author'][1]['first'] = 'Jane';
 * addarray['author'][1]['last']  = 'Doe';
 * bibtex.addEntry(addarray);
 */

// ------------BEGIN PHP FUNCTIONS -------------------------------------------------------------- //

// {{{ array
function array( ) {
    // #!#!#!#!# array::$descr1 does not contain valid 'array' at line 258
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_array/
    // +       version: 805.1716
    // +   original by: d3x
    // *     example 1: array('Kevin', 'van', 'Zonneveld');
    // *     returns 1: ['Kevin', 'van', 'Zonneveld'];

    return Array.prototype.slice.call(arguments);
}// }}}

// {{{ array_key_exists
function array_key_exists ( key, search ) {
    // Checks if the given key or index exists in the array
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_array_key_exists/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Felix Geisendoerfer (http://www.debuggable.com/felix)
    // *     example 1: array_key_exists('kevin', {'kevin': 'van Zonneveld'});
    // *     returns 1: true

    // input sanitation
    if( !search || (search.constructor !== Array && search.constructor !== Object) ){
        return false;
    }

    return key in search;
}// }}}// {{{ array_keys
function array_keys( input, search_value, strict ) {
    // Return all the keys of an array
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_array_keys/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} );
    // *     returns 1: {0: 'firstname', 1: 'surname'}

    var tmp_arr = new Array(), strict = !!strict, include = true, cnt = 0;

    for ( key in input ){
        include = true;
        if ( search_value != undefined ) {
            if( strict && input[key] !== search_value ){
                include = false;
            } else if( input[key] != search_value ){
                include = false;
            }
        }

        if( include ) {
            tmp_arr[cnt] = key;
            cnt++;
        }
    }

    return tmp_arr;
}// }}}

// {{{ in_array
function in_array(needle, haystack, strict) {
    // Checks if a value exists in an array
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_in_array/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: true

    var found = false, key, strict = !!strict;

    for (key in haystack) {
        if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
            found = true;
            break;
        }
    }

    return found;
}// }}}

// {{{ sizeof
function sizeof ( mixed_var, mode ) {
    // Alias of count()
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_sizeof/
    // +       version: 804.1712
    // +   original by: Philip Peterson
    // -    depends on: count
    // *     example 1: sizeof([[0,0],[0,-4]], 'COUNT_RECURSIVE');
    // *     returns 1: 6
    // *     example 2: sizeof({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE');
    // *     returns 2: 6

    return count( mixed_var, mode );
}// }}}

// {{{ count
function count( mixed_var, mode ) {
    // Count elements in an array, or properties in an object
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_count/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: _argos
    // *     example 1: count([[0,0],[0,-4]], 'COUNT_RECURSIVE');
    // *     returns 1: 6
    // *     example 2: count({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE');
    // *     returns 2: 6

    var key, cnt = 0;

    if( mode == 'COUNT_RECURSIVE' ) mode = 1;
    if( mode != 1 ) mode = 0;

    for (key in mixed_var){
        cnt++;
        if( mode==1 && mixed_var[key] && (mixed_var[key].constructor === Array || mixed_var[key].constructor === Object) ){
            cnt += count(mixed_var[key], 1);
        }
    }

    return cnt;
}// }}}

// {{{ explode
function explode( delimiter, string, limit ) {
    // Split a string by string
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_explode/
    // +       version: 805.1715
    // +     original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +     improved by: kenneth
    // +     improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +     improved by: d3x
    // +     bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: explode(' ', 'Kevin van Zonneveld');
    // *     returns 1: {0: 'Kevin', 1: 'van', 2: 'Zonneveld'}
    // *     example 2: explode('=', 'a=bc=d', 2);
    // *     returns 2: ['a', 'bc=d']

    var emptyArray = { 0: '' };

    // third argument is not required
    if ( arguments.length < 2
        || typeof arguments[0] == 'undefined'
        || typeof arguments[1] == 'undefined' )
    {
        return null;
    }

    if ( delimiter === ''
        || delimiter === false
        || delimiter === null )
    {
        return false;
    }

    if ( typeof delimiter == 'function'
        || typeof delimiter == 'object'
        || typeof string == 'function'
        || typeof string == 'object' )
    {
        return emptyArray;
    }

    if ( delimiter === true ) {
        delimiter = '1';
    }

    if (!limit) {
        return string.toString().split(delimiter.toString());
    } else {
        // support for limit argument
        var splitted = string.toString().split(delimiter.toString());
        var partA = splitted.splice(0, limit - 1);
        var partB = splitted.join(delimiter.toString());
        partA.push(partB);
        return partA;
    }
}// }}}

// {{{ implode
function implode( glue, pieces ) {
    // Join array elements with a string
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_implode/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: _argos
    // *     example 1: implode(' ', ['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: 'Kevin van Zonneveld'

    return ( ( pieces instanceof Array ) ? pieces.join ( glue ) : pieces );
}// }}}

// {{{ join
function join( glue, pieces ) {
    // Alias of implode()
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_join/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: implode
    // *     example 1: join(' ', ['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: 'Kevin van Zonneveld'

    return implode( glue, pieces );
}// }}}

// {{{ split
function split( delimiter, string ) {
    // Split string into array by regular expression
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_split/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: explode
    // *     example 1: split(' ', 'Kevin van Zonneveld');
    // *     returns 1: {0: 'Kevin', 1: 'van', 2: 'Zonneveld'}

    return explode( delimiter, string );
}// }}}

// {{{ str_replace
function str_replace(search, replace, subject) {
    // Replace all occurrences of the search string with the replacement string
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_str_replace/
    // +       version: 805.3114
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Gabriel Paderni
    // +   improved by: Philip Peterson
    // +   improved by: Simon Willison (http://simonwillison.net)
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // -    depends on: is_array
    // *     example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
    // *     returns 1: 'Kevin.van.Zonneveld'
    // *     example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
    // *     returns 2: 'hemmo, mars'

    var f = search, r = replace, s = subject;
    var ra = is_array(r), sa = is_array(s), f = [].concat(f), r = [].concat(r), i = (s = [].concat(s)).length;

    while (j = 0, i--) {
        while (s[i] = s[i].split(f[j]).join(ra ? r[j] || "" : r[0]), ++j in f){};
    };

    return sa ? s : s[0];
}// }}}

// {{{ strlen
function strlen( string ){
    // Get string length
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_strlen/
    // +       version: 805.1616
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Sakimori
    // *     example 1: strlen('Kevin van Zonneveld');
    // *     returns 1: 19

    return ("" + string).length;
}// }}}

// {{{ strpos
function strpos( haystack, needle, offset){
    // Find position of first occurrence of a string
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_strpos/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: strpos('Kevin van Zonneveld', 'e', 5);
    // *     returns 1: 14

    var i = haystack.indexOf( needle, offset ); // returns -1
    return i >= 0 ? i : false;
}// }}}

// {{{ strrpos
function strrpos( haystack, needle, offset){
    // Find position of last occurrence of a char in a string
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_strrpos/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: strrpos('Kevin van Zonneveld', 'e');
    // *     returns 1: 16

    var i = haystack.lastIndexOf( needle, offset ); // returns -1
    return i >= 0 ? i : false;
}// }}}

// {{{ strtolower
function strtolower( str ) {
    // Make a string lowercase
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_strtolower/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: strtolower('Kevin van Zonneveld');
    // *     returns 1: 'kevin van zonneveld'

    return str.toLowerCase();
}// }}}

// {{{ strtoupper
function strtoupper( str ) {
    // Make a string uppercase
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_strtoupper/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: strtoupper('Kevin van Zonneveld');
    // *     returns 1: 'KEVIN VAN ZONNEVELD'

    return str.toUpperCase();
}// }}}

// {{{ substr
function substr( f_string, f_start, f_length ) {
    // Return part of a string
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_substr/
    // +       version: 804.1712
    // +     original by: Martijn Wieringa
    // *         example 1: substr('abcdef', 0, -1);
    // *         returns 1: 'abcde'

    if(f_start < 0) {
        f_start += f_string.length;
    }

    if(f_length == undefined) {
        f_length = f_string.length;
    } else if(f_length < 0){
        f_length += f_string.length;
    } else {
        f_length += f_start;
    }

    if(f_length < f_start) {
        f_length = f_start;
    }

    return f_string.substring(f_start, f_length);
}// }}}

// {{{ trim
function trim( str, charlist ) {
    // Strip whitespace (or other characters) from the beginning and end of a string
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_trim/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: mdsjack (http://www.mdsjack.bo.it)
    // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: DxGx
    // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // *     example 1: trim('    Kevin van Zonneveld    ');
    // *     returns 1: 'Kevin van Zonneveld'
    // *     example 2: trim('Hello World', 'Hdle');
    // *     returns 2: 'o Wor'
    if (!str) { return ''; }
    var whitespace;

    if(!charlist){
        whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    } else{
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
    }

	for (var i = 0; i < str.length; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
		str = str.substring(i);
		break;
		}
	}
	for (i = str.length - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
    	}
	}
	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}// }}}


// {{{ wordwrap
function wordwrap( str, int_width, str_break, cut ) {
    // Wraps a string to a given number of characters
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_wordwrap/
    // +       version: 804.1715
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Nick Callen
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // *     example 1: wordwrap('Kevin van Zonneveld', 6, '|', true);
    // *     returns 1: 'Kevin |van |Zonnev|eld'

    var m = int_width, b = str_break, c = cut;
    var i, j, l, s, r;

    if(m < 1) {
        return str;
    }
    for(i = -1, l = (r = str.split("\n")).length; ++i < l; r[i] += s) {
        for(s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : "")){
            j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
        }
    }

    return r.join("\n");
}// }}}

// {{{ is_string
function is_string( mixed_var ){
    // Find whether the type of a variable is string
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_is_string/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: is_string('23');
    // *     returns 1: true
    // *     example 2: is_string(23.5);
    // *     returns 2: false

    return (typeof( mixed_var ) == 'string');
}// }}}


// {{{ ord
function ord( string ) {
    // Return ASCII value of character
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_ord/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: ord('K');
    // *     returns 1: 75

    return string.charCodeAt(0);
}// }}}

// {{{ array_unique
function array_unique( array ) {
    // Removes duplicate values from an array
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_array_unique/
    // +       version: 805.211
    // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +      input by: duncan
    // +    bufixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: array_unique(['Kevin','Kevin','van','Zonneveld']);
    // *     returns 1: ['Kevin','van','Zonneveld']

    var p, i, j, tmp_arr = array;
    for(i = tmp_arr.length; i;){
        for(p = --i; p > 0;){
            if(tmp_arr[i] === tmp_arr[--p]){
                for(j = p; --p && tmp_arr[i] === tmp_arr[p];);
                i -= tmp_arr.splice(p + 1, j - p).length;
            }
        }
    }

    return tmp_arr;
}// }}}

// {{{ print_r
function print_r( array, return_val ) {
    // Prints human-readable information about a variable
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_print_r/
    // +       version: 805.2023
    // +   original by: Michael White (http://crestidg.com)
    // +   improved by: Ben Bryan
    // *     example 1: print_r(1, true);
    // *     returns 1: 1

    var output = "", pad_char = " ", pad_val = 4;

    var formatArray = function (obj, cur_depth, pad_val, pad_char) {
        if (cur_depth > 0) {
            cur_depth++;
        }

        var base_pad = repeat_char(pad_val*cur_depth, pad_char);
        var thick_pad = repeat_char(pad_val*(cur_depth+1), pad_char);
        var str = "";

        if (obj instanceof Array || obj instanceof Object) {
            str += "Array\n" + base_pad + "(\n";
            for (var key in obj) {
                if (obj[key] instanceof Array || obj[key] instanceof Object) {
                    str += thick_pad + "["+key+"] => "+formatArray(obj[key], cur_depth+1, pad_val, pad_char);
                } else {
                    str += thick_pad + "["+key+"] => " + obj[key] + "\n";
                }
            }
            str += base_pad + ")\n";
        } else {
            str = obj.toString();
        }

        return str;
    };

    var repeat_char = function (len, pad_char) {
        var str = "";
        for(var i=0; i < len; i++) {
            str += pad_char;
        };
        return str;
    };
    output = formatArray(array, 0, pad_val, pad_char);

    if (return_val !== true) {
        document.write("<pre>" + output + "</pre>");
        return true;
    } else {
        return output;
    }
}// }}}
// {{{ is_array
function is_array( mixed_var ) {
    // Finds whether a variable is an array
    //
    // +    discuss at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_is_array/
    // +       version: 804.1712
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Legaev Andrey
    // +   bugfixed by: Cord
    // *     example 1: is_array(['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: true
    // *     example 2: is_array('Kevin van Zonneveld');
    // *     returns 2: false

    return ( mixed_var instanceof Array );
}// }}}

//------------END PHP FUNCTIONS --------------------------------------------------------------   //

/**
 * BibTex
 *
 * A class which provides common methods to access and
 * create Strings in BibTex format+
 * Example 1: Parsing a BibTex File and returning the number of entries
 * <code>
 * bibtex = new BibTex();
 * bibtex.content = '....';
 *
 * bibtex.parse();
 * print "There are "+bibtex.amount()+" entries";
 * </code>
 * Example 2: Parsing a BibTex File and getting all Titles
 * <code>
 * bibtex = new BibTex();
 * bibtex.content="...";
 * bibtex.parse();
 * for (var i in bibtex.data) {
 *  alert( bibtex.data[i]['title']+"<br />");
 * }
 * </code>
 * Example 3: Adding an entry and printing it in BibTex Format
 * <code>
 * bibtex                         = new BibTex();
 * addarray                       = {}
 * addarray['entryType']          = 'Article';
 * addarray['cite']               = 'art2';
 * addarray['title']              = 'Titel2';
 * addarray['author']			  = [];
 * addarray['author'][0]['first'] = 'John';
 * addarray['author'][0]['last']  = 'Doe';
 * addarray['author'][1]['first'] = 'Jane';
 * addarray['author'][1]['last']  = 'Doe';
 * bibtex.addEntry(addarray);
 * alert( nl2br(bibtex.bibTex()));
 * </code>
 *
 * @category   Structures
 * @package    BibTex
 * @author     Steve Hannah <shannah at sfu dot ca>
 * @adapted-from Structures_BibTex by  Elmar Pitschke <elmar+pitschke@gmx+de>
 * @copyright  2008 Simon Fraser University
 * @license    http://www.gnu.org/licenses/lgpl.html
 * @version    Release: 0.1
 * @link       http://webgroup.fas.sfu.ca/projects/JSBibTexParser
 */
function BibTex(options)
{

	if ( typeof options == 'undefined' ) options = {};
    /**
     * Array with the BibTex Data
     *
     * @access public
     * @var array
     */
    this.data;
    /**
     * String with the BibTex content
     *
     * @access public
     * @var string
     */
    this.content;
    /**
     * Array with possible Delimiters for the entries
     *
     * @access private
     * @var array
     */
    this._delimiters;
    /**
     * Array to store warnings
     *
     * @access public
     * @var array
     */
    this.warnings;
    /**
     * Run-time configuration options
     *
     * @access private
     * @var array
     */
    this._options;
    /**
     * RTF Format String
     *
     * @access public
     * @var string
     */
    this.rtfstring;
    /**
     * HTML Format String
     *
     * @access public
     * @var string
     */
    this.htmlstring;
    /**
     * Array with the "allowed" entry types
     *
     * @access public
     * @var array
     */
    this.allowedEntryTypes;
    /**
     * Author Format Strings
     *
     * @access public
     * @var string
     */
    this.authorstring;

    this._delimiters     = {'"':'"',
                                        '{':'}'};
	this.data            = [];
	this.content         = '';
	//this._stripDelimiter = stripDel;
	//this._validate       = val;
	this.warnings        = [];
	this._options        = {
		'stripDelimiter'    : true,
		'validate'          : true,
		'unwrap'            : false,
		'wordWrapWidth'     : false,
		'wordWrapBreak'     : "\n",
		'wordWrapCut'       : 0,
		'removeCurlyBraces' : false,
		'extractAuthors'    : true
	};
	for (option in options) {
		test = this.setOption(option, options[option]);
		if (this.isError(test)) {
			//Currently nothing is done here, but it could for example raise an warning
		}
	}
	this.rtfstring         = 'AUTHORS, "{\b TITLE}", {\i JOURNAL}, YEAR';
	this.htmlstring        = 'AUTHORS, "<strong>TITLE</strong>", <em>JOURNAL</em>, YEAR<br />';
	this.allowedEntryTypes = array(
		'article',
		'book',
		'booklet',
		'conference',
		'inbook',
		'incollection',
		'inproceedings',
		'manual',
		'masterthesis',
		'misc',
		'phdthesis',
		'proceedings',
		'techreport',
		'unpublished'
	);
	this.authorstring = 'VON LAST, JR, FIRST';

}


BibTex.prototype = {

    /**
     * Constructor
     *
     * @access public
     * @return void
     */


    /**
     * Sets run-time configuration options
     *
     * @access public
     * @param string option option name
     * @param mixed  value value for the option
     * @return mixed true on success PEAR_Error on failure
     */
    setOption : function(option, value)
    {
        ret = true;
        if (array_key_exists(option, this._options)) {
            this._options[option] = value;
        } else {
            ret = this.raiseError('Unknown option '+option);
        }
        return ret;
    },

    /**
     * Reads a give BibTex File
     *
     * @access public
     * @param string filename Name of the file
     * @return mixed true on success PEAR_Error on failure
     *
    function loadFile(filename)
    {
        if (file_exists(filename)) {
            if ((this.content = @file_get_contents(filename)) === false) {
                return PEAR::raiseError('Could not open file '+filename);
            } else {
                this._pos    = 0;
                this._oldpos = 0;
                return true;
            }
        } else {
            return PEAR::raiseError('Could not find file '+filename);
        }
    }
	*/
    /**
     * Parses what is stored in content and clears the content if the parsing is successfull+
     *
     * @access public
     * @return boolean true on success and PEAR_Error if there was a problem
     */
    parse: function()
    {
    	//alert("starting to parse");
        //The amount of opening braces is compared to the amount of closing braces
        //Braces inside comments are ignored
        this.warnings = [];
        this.data     = [];
        var valid          = true;
        var open           = 0;
        var entry          = false;
        var charv           = '';
        var lastchar       = '';
        var buffer         = '';
        for (var i = 0; i < strlen(this.content); i++) {
            charv = substr(this.content, i, 1);
            if ((0 != open) && ('@' == charv)) {
                if (!this._checkAt(buffer)) {
                    this._generateWarning('WARNING_MISSING_END_BRACE', '', buffer);
                    //To correct the data we need to insert a closing brace
                    charv     = '}';
                    i--;
                }
            }
            if ((0 == open) && ('@' == charv)) { //The beginning of an entry
                entry = true;
            } else if (entry && ('{' == charv) && ('\\' != lastchar)) { //Inside an entry and non quoted brace is opening
                open++;
            } else if (entry && ('}' == charv) && ('\\' != lastchar)) { //Inside an entry and non quoted brace is closing
                open--;
                if (open < 0) { //More are closed than opened
                    valid = false;
                }
                if (0 == open) { //End of entry
                    entry     = false;
                    var entrydata = this._parseEntry(buffer);
                    if (!entrydata) {
                        /**
                         * This is not yet used+
                         * We are here if the Entry is either not correct or not supported+
                         * But this should already generate a warning+
                         * Therefore it should not be necessary to do anything here
                         */
                    } else {
                        this.data[this.data.length] = entrydata;
                    }
                    buffer = '';
                }
            }
            if (entry) { //Inside entry
                buffer += charv;
            }
            lastchar = charv;
        }
        //If open is one it may be possible that the last ending brace is missing
        if (1 == open) {
            entrydata = this._parseEntry(buffer);
            if (!entrydata) {
                valid = false;
            } else {
                this.data[this.data.length] = entrydata;
                buffer = '';
                open   = 0;
            }
        }
        //At this point the open should be zero
        if (0 != open) {
            valid = false;
        }
        //Are there Multiple entries with the same cite?
        if (this._options['validate']) {
            cites = [];
            for (var i=0; i< this.data.length; i++ ) {
                cites[cites.length] = this.data[i]['cite'];
            }
            unique = array_unique(cites);
            if (cites.length != sizeof(unique)) { //Some values have not been unique!
                notuniques = [];
                for (var i = 0; i < cites.length; i++) {
                    if ('' == unique[i]) {
                        notuniques[notuniques.length] = cites[i];
                    }
                }
                this._generateWarning('WARNING_MULTIPLE_ENTRIES', implode(',',notuniques));
            }
        }
        //alert("finished parsing");
        if (valid) {
            this.content = '';
            return true;
        } else {
            return this.raiseError('Unbalanced parenthesis');
        }
    },

    /**
     * Extracting the data of one content
     *
     * The parse function splits the content into its entries+
     * Then every entry is parsed by this function+
     * It parses the entry backwards+
     * First the last '=' is searched and the value extracted from that+
     * A copy is made of the entry if warnings should be generated+ This takes quite
     * some memory but it is needed to get good warnings+ If nor warnings are generated
     * then you don have to worry about memory+
     * Then the last ',' is searched and the field extracted from that+
     * Again the entry is shortened+
     * Finally after all field:value pairs the cite and type is extraced and the
     * authors are splitted+
     * If there is a problem false is returned+
     *
     * @access private
     * @param string entry The entry
     * @return array The representation of the entry or false if there is a problem
     */
    '_parseEntry': function(entry)
    {
        var entrycopy = '';
        if (this._options['validate']) {
            entrycopy = entry; //We need a copy for printing the warnings
        }
        var ret = {};
        if ('@string' ==  strtolower(substr(entry, 0, 7))) {
            //String are not yet supported!
            if (this._options['validate']) {
                this._generateWarning('STRING_ENTRY_NOT_YET_SUPPORTED', '', entry+'}');
            }
        } else if ('@preamble' ==  strtolower(substr(entry, 0, 9))) {
            //Preamble not yet supported!
            if (this._options['validate']) {
                this._generateWarning('PREAMBLE_ENTRY_NOT_YET_SUPPORTED', '', entry+'}');
            }
        } else {
            //Parsing all fields
            while (strrpos(entry,'=') !== false) {
                position = strrpos(entry, '=');
                //Checking that the equal sign is not quoted or is not inside a equation (For example in an abstract)
                proceed  = true;
                if (substr(entry, position-1, 1) == '\\') {
                    proceed = false;
                }
                if (proceed) {
                    proceed = this._checkEqualSign(entry, position);
                }
                while (!proceed) {
                    substring = substr(entry, 0, position);
                    position  = strrpos(substring,'=');
                    proceed   = true;
                    if (substr(entry, position-1, 1) == '\\') {
                        proceed = false;
                    }
                    if (proceed) {
                        proceed = this._checkEqualSign(entry, position);
                    }
                }

                value = trim(substr(entry, position+1));
                entry = substr(entry, 0, position);

                if (',' == substr(value, strlen(value)-1, 1)) {
                    value = substr(value, 0, -1);
                }
                if (this._options['validate']) {
                    this._validateValue(value, entrycopy);
                }
                if (this._options['stripDelimiter']) {
                    value = this._stripDelimiter(value);
                }
                if (this._options['unwrap']) {
                    value = this._unwrap(value);
                }
                if (this._options['removeCurlyBraces']) {
                    value = this._removeCurlyBraces(value);
                }
                position    = strrpos(entry, ',');
                field       = strtolower(trim(substr(entry, position+1)));
                ret[field] = value;
                entry       = substr(entry, 0, position);
            }
            //Parsing cite and entry type
            var arr = entry.split('{');
            ret['cite'] = trim(arr[1]);
            ret['entryType'] = strtolower(trim(arr[0]));
            //alert(array_keys(ret));
            if ('@' == ret['entryType'].substring(0,1)) {
                ret['entryType'] = substr(ret['entryType'], 1);
            }
            if (this._options['validate']) {
                if (!this._checkAllowedEntryType(ret['entryType'])) {
                    this._generateWarning('WARNING_NOT_ALLOWED_ENTRY_TYPE', ret['entryType'], entry+'}');
                }
            }
            //Handling the authors
            if (in_array('author', array_keys(ret)) && this._options['extractAuthors']) {
                ret['author'] = this._extractAuthors(ret['author']);
            }
        }
        return ret;
    },

    /**
     * Checking whether the position of the '=' is correct
     *
     * Sometimes there is a problem if a '=' is used inside an entry (for example abstract)+
     * This method checks if the '=' is outside braces then the '=' is correct and true is returned+
     * If the '=' is inside braces it contains to a equation and therefore false is returned+
     *
     * @access private
     * @param string entry The text of the whole remaining entry
     * @param int the current used place of the '='
     * @return bool true if the '=' is correct, false if it contains to an equation
     */
    '_checkEqualSign': function(entry, position)
    {
        var ret = true;
        //This is getting tricky
        //We check the string backwards until the position and count the closing an opening braces
        //If we reach the position the amount of opening and closing braces should be equal
        var length = strlen(entry);
        var open   = 0;
        for (var i = length-1; i >= position; i--) {
            precedingchar = substr(entry, i-1, 1);
            charv          = substr(entry, i, 1);
            if (('{' == charv) && ('\\' != precedingchar)) {
                open++;
            }
            if (('}' == charv) && ('\\' != precedingchar)) {
                open--;
            }
        }
        if (0 != open) {
            ret = false;
        }
        //There is still the posibility that the entry is delimited by double quotes+
        //Then it is possible that the braces are equal even if the '=' is in an equation+
        if (ret) {
            entrycopy = trim(entry);
            lastchar  = substr(entrycopy,strlen(entrycopy)-1,1);
            if (',' == lastchar) {
                lastchar = substr(entrycopy, strlen(entrycopy)-2, 1);
            }
            if ('"' == lastchar) {
                //The return value is set to false
                //If we find the closing " before the '=' it is set to true again+
                //Remember we begin to search the entry backwards so the " has to show up twice - ending and beginning delimiter
                ret = false;
                found = 0;
                for (var i = length; i >= position; i--) {
                    precedingchar = substr(entry, i-1, 1);
                    charv          = substr(entry, i, 1);
                    if (('"' == charv) && ('\\' != precedingchar)) {
                        found++;
                    }
                    if (2 == found) {
                        ret = true;
                        break;
                    }
                }
            }
        }
        return ret;
    },

    /**
     * Checking if the entry type is allowed
     *
     * @access private
     * @param string entry The entry to check
     * @return bool true if allowed, false otherwise
     */
    '_checkAllowedEntryType': function(entry)
    {
        return in_array(entry, this.allowedEntryTypes);
    },

    /**
     * Checking whether an at is outside an entry
     *
     * Sometimes an entry misses an entry brace+ Then the at of the next entry seems to be
     * inside an entry+ This is checked here+ When it is most likely that the at is an opening
     * at of the next entry this method returns true+
     *
     * @access private
     * @param string entry The text of the entry until the at
     * @return bool true if the at is correct, false if the at is likely to begin the next entry+
     */
    '_checkAt': function(entry)
    {
        var ret     = false;
        var opening = array_keys(this._delimiters);
        var closing = array_values(this._delimiters);
        //Getting the value (at is only allowd in values)
        if (strrpos(entry,'=') !== false) {
            position = strrpos(entry, '=');
            proceed  = true;
            if (substr(entry, position-1, 1) == '\\') {
                proceed = false;
            }
            while (!proceed) {
                substring = substr(entry, 0, position);
                position  = strrpos(substring,'=');
                proceed   = true;
                if (substr(entry, position-1, 1) == '\\') {
                    proceed = false;
                }
            }
            value    = trim(substr(entry, position+1));
            open     = 0;
            charv     = '';
            lastchar = '';
            for (var i = 0; i < strlen(value); i++) {
                charv = substr(this.content, i, 1);
                if (in_array(charv, opening) && ('\\' != lastchar)) {
                    open++;
                } else if (in_array(charv, closing) && ('\\' != lastchar)) {
                    open--;
                }
                lastchar = charv;
            }
            //if open is grater zero were are inside an entry
            if (open>0) {
                ret = true;
            }
        }
        return ret;
    },

    /**
     * Stripping Delimiter
     *
     * @access private
     * @param string entry The entry where the Delimiter should be stripped from
     * @return string Stripped entry
     */
    '_stripDelimiter': function(entry)
    {
        var beginningdels = array_keys(this._delimiters);
        var ength        = strlen(entry);
        var firstchar     = substr(entry, 0, 1);
        var lastchar      = substr(entry, -1, 1);
        while (in_array(firstchar, beginningdels)) { //The first character is an opening delimiter
            if (lastchar == this._delimiters[firstchar]) { //Matches to closing Delimiter
                entry = substr(entry, 1, -1);
            } else {
                break;
            }
            firstchar = substr(entry, 0, 1);
            lastchar  = substr(entry, -1, 1);
        }
        return entry;
    },

    /**
     * Unwrapping entry
     *
     * @access private
     * @param string entry The entry to unwrap
     * @return string unwrapped entry
     */
    '_unwrap': function(entry)
    {
        entry = entry.replace(/\s+/, ' ');
        return trim(entry);
    },

    /**
     * Wordwrap an entry
     *
     * @access private
     * @param string entry The entry to wrap
     * @return string wrapped entry
     */
    '_wordwrap': function(entry)
    {
        if ( (''!=entry) && (is_string(entry)) ) {
            entry = wordwrap(entry, this._options['wordWrapWidth'], this._options['wordWrapBreak'], this._options['wordWrapCut']);
        }
        return entry;
    },

    /**
     * Extracting the authors
     *
     * @access private
     * @param string entry The entry with the authors
     * @return array the extracted authors
     */
    '_extractAuthors': function(entry) {
        entry       = this._unwrap(entry);
        var authorarray = entry.split(' and ');
        for (var i = 0; i < authorarray.length; i++) {
            var author = trim(authorarray[i]);
            /*The first version of how an author could be written (First von Last)
             has no commas in it*/
            var first    = '';
            var von      = '';
            var last     = '';
            var jr       = '';
            if (strpos(author, ',') === false) {
                var tmparray = author.split(' |~');
                var size     = tmparray.length;
                if (1 == size) { //There is only a last
                    last = tmparray[0];
                } else if (2 == size) { //There is a first and a last
                    first = tmparray[0];
                    last  = tmparray[1];
                } else {
                    var invon  = false;
                    var inlast = false;
                    for (var j=0; j<(size-1); j++) {
                        if (inlast) {
                            last += ' '+tmparray[j];
                        } else if (invon) {
                            casev = this._determineCase(tmparray[j]);
                            if (this.isError(casev)) {
                                // IGNORE?
                            } else if ((0 == casev) || (-1 == casev)) { //Change from von to last
                                //You only change when there is no more lower case there
                                islast = true;
                                for (var k=(j+1); k<(size-1); k++) {
                                    futurecase = this._determineCase(tmparray[k]);
                                    if (this.isError(casev)) {
                                        // IGNORE?
                                    } else if (0 == futurecase) {
                                        islast = false;
                                    }
                                }
                                if (islast) {
                                    inlast = true;
                                    if (-1 == casev) { //Caseless belongs to the last
                                        last += ' '+tmparray[j];
                                    } else {
                                        von  += ' '+tmparray[j];
                                    }
                                } else {
                                    von    += ' '+tmparray[j];
                                }
                            } else {
                                von += ' '+tmparray[j];
                            }
                        } else {
                            var casev = this._determineCase(tmparray[j]);
                            if (this.isError(casev)) {
                                // IGNORE?
                            } else if (0 == casev) { //Change from first to von
                                invon = true;
                                von   += ' '+tmparray[j];
                            } else {
                                first += ' '+tmparray[j];
                            }
                        }
                    }
                    //The last entry is always the last!
                    last += ' '+tmparray[size-1];
                }
            } else { //Version 2 and 3
                var tmparray     = [];
                tmparray     = explode(',', author);
                //The first entry must contain von and last
                vonlastarray = [];
                vonlastarray = explode(' ', tmparray[0]);
                size         = sizeof(vonlastarray);
                if (1==size) { //Only one entry.got to be the last
                    last = vonlastarray[0];
                } else {
                    inlast = false;
                    for (var j=0; j<(size-1); j++) {
                        if (inlast) {
                            last += ' '+vonlastarray[j];
                        } else {
                            if (0 != (this._determineCase(vonlastarray[j]))) { //Change from von to last
                                islast = true;
                                for (var k=(j+1); k<(size-1); k++) {
                                    this._determineCase(vonlastarray[k]);
                                    casev = this._determineCase(vonlastarray[k]);
                                    if (this.isError(casev)) {
                                        // IGNORE?
                                    } else if (0 == casev) {
                                        islast = false;
                                    }
                                }
                                if (islast) {
                                    inlast = true;
                                    last   += ' '+vonlastarray[j];
                                } else {
                                    von    += ' '+vonlastarray[j];
                                }
                            } else {
                                von    += ' '+vonlastarray[j];
                            }
                        }
                    }
                    last += ' '+vonlastarray[size-1];
                }
                //Now we check if it is version three (three entries in the array (two commas)
                if (3==tmparray.length) {
                    jr = tmparray[1];
                }
                //Everything in the last entry is first
                first = tmparray[tmparray.length-1];
            }
            authorarray[i] = {'first':trim(first), 'von':trim(von), 'last':trim(last), 'jr':trim(jr)};
        }
        return authorarray;
    },

    /**
     * Case Determination according to the needs of BibTex
     *
     * To parse the Author(s) correctly a determination is needed
     * to get the Case of a word+ There are three possible values:
     * - Upper Case (return value 1)
     * - Lower Case (return value 0)
     * - Caseless   (return value -1)
     *
     * @access private
     * @param string word
     * @return int The Case or PEAR_Error if there was a problem
     */
    '_determineCase': function(word) {
        var ret         = -1;
        var trimmedword = trim (word);
        /*We need this variable+ Without the next of would not work
         (trim changes the variable automatically to a string!)*/
        if (is_string(word) && (strlen(trimmedword) > 0)) {
            var i         = 0;
            var found     = false;
            var openbrace = 0;
            while (!found && (i <= strlen(word))) {
                var letter = substr(trimmedword, i, 1);
                var ordv    = ord(letter);
                if (ordv == 123) { //Open brace
                    openbrace++;
                }
                if (ordv == 125) { //Closing brace
                    openbrace--;
                }
                if ((ordv>=65) && (ordv<=90) && (0==openbrace)) { //The first character is uppercase
                    ret   = 1;
                    found = true;
                } else if ( (ordv>=97) && (ordv<=122) && (0==openbrace) ) { //The first character is lowercase
                    ret   = 0;
                    found = true;
                } else { //Not yet found
                    i++;
                }
            }
        } else {
            ret = this.raiseError('Could not determine case on word: '+word);
        }
        return ret;
    },


    'isError': function(obj){
    	return ( typeof(obj) == 'Object' && obj.isError == 1 );

    },

    /**
     * Validation of a value
     *
     * There may be several problems with the value of a field+
     * These problems exist but do not break the parsing+
     * If a problem is detected a warning is appended to the array warnings+
     *
     * @access private
     * @param string entry The entry aka one line which which should be validated
     * @param string wholeentry The whole BibTex Entry which the one line is part of
     * @return void
     */
    '_validateValue': function(entry, wholeentry)
    {
        //There is no @ allowed if the entry is enclosed by braces
        if ( entry.match(/^{.*@.*}/)) {
            this._generateWarning('WARNING_AT_IN_BRACES', entry, wholeentry);
        }
        //No escaped " allowed if the entry is enclosed by double quotes
        if (entry.match(/^\".*\\".*\"/)) {
            this._generateWarning('WARNING_ESCAPED_DOUBLE_QUOTE_INSIDE_DOUBLE_QUOTES', entry, wholeentry);
        }
        //Amount of Braces is not correct
        var open     = 0;
        var lastchar = '';
        var charv     = '';
        for (var i = 0; i < strlen(entry); i++) {
            charv = substr(entry, i, 1);
            if (('{' == charv) && ('\\' != lastchar)) {
                open++;
            }
            if (('}' == charv) && ('\\' != lastchar)) {
                open--;
            }
            lastchar = charv;
        }
        if (0 != open) {
            this._generateWarning('WARNING_UNBALANCED_AMOUNT_OF_BRACES', entry, wholeentry);
        }
    },

    /**
     * Remove curly braces from entry
     *
     * @access private
     * @param string value The value in which curly braces to be removed
     * @param string Value with removed curly braces
     */
    '_removeCurlyBraces': function(value)
    {
        //First we save the delimiters
        var beginningdels = array_keys(this._delimiters);
        var firstchar     = substr(value, 0, 1);
        var lastchar      = substr(value, -1, 1);
        var begin         = '';
        var end           = '';
        while (in_array(firstchar, beginningdels)) { //The first character is an opening delimiter
            if (lastchar == this._delimiters[firstchar]) { //Matches to closing Delimiter
                begin += firstchar;
                end   += lastchar;
                value  = substr(value, 1, -1);
            } else {
                break;
            }
            firstchar = substr(value, 0, 1);
            lastchar  = substr(value, -1, 1);
        }
        //Now we get rid of the curly braces
        var pattern     = '/([^\\\\])\{(+*?[^\\\\])\}/';
        var replacement = '12';
        value       = value.replace(/([^\\\\])\{(.*?[^\\\\])\}/, replacement);
        //Reattach delimiters
        value       = begin+value+end;
        return value;
    },

    /**
     * Generates a warning
     *
     * @access private
     * @param string type The type of the warning
     * @param string entry The line of the entry where the warning occurred
     * @param string wholeentry OPTIONAL The whole entry where the warning occurred
     */
    '_generateWarning': function(type, entry, wholeentry)
    {
    	if ( typeof wholeentry == 'undefined' ) wholeentry = '';
        var warning = {};
        warning['warning']    = type;
        warning['entry']      = entry;
        warning['wholeentry'] = wholeentry;
        this.warnings[this.warnings.length]      = warning;
    },

    /**
     * Cleares all warnings
     *
     * @access public
     */
    'clearWarnings': function()
    {
        this.warnings = array();
    },

    /**
     * Is there a warning?
     *
     * @access public
     * @return true if there is, false otherwise
     */
    'hasWarning': function()
    {
        if (sizeof(this.warnings)>0) return true;
        else return false;
    },

    /**
     * Returns the amount of available BibTex entries
     *
     * @access public
     * @return int The amount of available BibTex entries
     */
    'amount': function()
    {
        return sizeof(this.data);
    },
    /**
     * Returns the author formatted
     *
     * The Author is formatted as setted in the authorstring
     *
     * @access private
     * @param array array Author array
     * @return string the formatted author string
     */
    '_formatAuthor': function(array)
    {
        if (!array_key_exists('von', array)) {
            array['von'] = '';
        } else {
            array['von'] = trim(array['von']);
        }
        if (!array_key_exists('last', array)) {
            array['last'] = '';
        } else {
            array['last'] = trim(array['last']);
        }
        if (!array_key_exists('jr', array)) {
            array['jr'] = '';
        } else {
            array['jr'] = trim(array['jr']);
        }
        if (!array_key_exists('first', array)) {
            array['first'] = '';
        } else {
            array['first'] = trim(array['first']);
        }
        ret = this.authorstring;
        ret = str_replace("VON", array['von'], ret);
        ret = str_replace("LAST", array['last'], ret);
        ret = str_replace("JR", array['jr'], ret);
        ret = str_replace("FIRST", array['first'], ret);
        return trim(ret);
    },

    /**
     * Converts the stored BibTex entries to a BibTex String
     *
     * In the field list, the author is the last field+
     *
     * @access public
     * @return string The BibTex string
     */
    'bibTex': function()
    {
        var bibtex = '';
        for (var i=0 ; i<this.data.length; i++) {
        	var entry = this.data[i];
            //Intro
            bibtex += '@'+strtolower(entry['entryType'])+' { '+entry['cite']+",\n";
            //Other fields except author
            for (key in entry) {
            	var val = entry[key];
                if (this._options['wordWrapWidth']>0) {
                    val = this._wordWrap(val);
                }
                if (!in_array(key, array('cite','entryType','author'))) {
                    bibtex += "\t"+key+' = {'+val+"},\n";
                }
            }
            //Author
            if (array_key_exists('author', entry)) {
                if (this._options['extractAuthors']) {
                    tmparray = []; //In this array the authors are saved and the joind with an and
                    for (j in entry['author']) {
                    	var authorentry = entry['author'][j];
                        tmparray[tmparray.length] = this._formatAuthor(authorentry);
                    }
                    author = join(' and ', tmparray);
                } else {
                    author = entry['author'];
                }
            } else {
                author = '';
            }
            bibtex += "\tauthor = {"+author+"}\n";
            bibtex+="}\n\n";
        }
        return bibtex;
    },

    /**
     * Adds a new BibTex entry to the data
     *
     * @access public
     * @param array newentry The new data to add
     * @return void
     */
    'addEntry': function(newentry)
    {
        this.data[this.data.length] = newentry;
    },

    /**
     * Returns statistic
     *
     * This functions returns a hash table+ The keys are the different
     * entry types and the values are the amount of these entries+
     *
     * @access public
     * @return array Hash Table with the data
     */
    'getStatistic': function()
    {
        var ret = array();
        for (var i=0; i<this.data.length; i++) {
        	var entry = this.data[i];
            if (array_key_exists(entry['entryType'], ret)) {
                ret[entry['entryType']]++;
            } else {
                ret[entry['entryType']] = 1;
            }
        }
        return ret;
    },

    /**
     * Returns the stored data in RTF format
     *
     * This method simply returns a RTF formatted string+ This is done very
     * simple and is not intended for heavy using and fine formatting+ This
     * should be done by BibTex! It is intended to give some kind of quick
     * preview or to send someone a reference list as word/rtf format (even
     * some people in the scientific field still use word)+ If you want to
     * change the default format you have to override the class variable
     * "rtfstring"+ This variable is used and the placeholders simply replaced+
     * Lines with no data cause an warning!
     *
     * @return string the RTF Strings
     */
    'rtf': function()
    {
        var ret = "{\\rtf\n";
        for (var i=0; i<this.data.length; i++) {
        	var entry = this.data[i];
            line    = this.rtfstring;
            title   = '';
            journal = '';
            year    = '';
            authors = '';
            if (array_key_exists('title', entry)) {
                title = this._unwrap(entry['title']);
            }
            if (array_key_exists('journal', entry)) {
                journal = this._unwrap(entry['journal']);
            }
            if (array_key_exists('year', entry)) {
                year = this._unwrap(entry['year']);
            }
            if (array_key_exists('author', entry)) {
                if (this._options['extractAuthors']) {
                    tmparray = []; //In this array the authors are saved and the joind with an and
                    for (var j in entry['author']) {
                    	var authorentry = entry['author'][j];
                        tmparray[tmparray.length] = this._formatAuthor(authorentry);
                    }
                    authors = join(', ', tmparray);
                } else {
                    authors = entry['author'];
                }
            }
            if ((''!=title) || (''!=journal) || (''!=year) || (''!=authors)) {
                line = str_replace("TITLE", title, line);
                line = str_replace("JOURNAL", journal, line);
                line = str_replace("YEAR", year, line);
                line = str_replace("AUTHORS", authors, line);
                line += "\n\\par\n";
                ret  += line;
            } else {
                this._generateWarning('WARNING_LINE_WAS_NOT_CONVERTED', '', print_r(entry,1));
            }
        }
        ret += '}';
        return ret;
    },

    /**
     * Returns the stored data in HTML format
     *
     * This method simply returns a HTML formatted string+ This is done very
     * simple and is not intended for heavy using and fine formatting+ This
     * should be done by BibTex! It is intended to give some kind of quick
     * preview+ If you want to change the default format you have to override
     * the class variable "htmlstring"+ This variable is used and the placeholders
     * simply replaced+
     * Lines with no data cause an warning!
     *
     * @return string the HTML Strings
     */
    'html': function(min,max)
    {
    	if ( typeof min == 'undefined' ) min = 0;
    	if ( typeof max == 'undefined' ) max = this.data.length;
        var ret = "<p>\n";
        for (var i =min; i<max; i++){
        	var entry = this.data[i];
            var line    = this.htmlstring;
            var title   = '';
            var journal = '';
            var year    = '';
            var authors = '';
            if (array_key_exists('title', entry)) {
                title = this._unwrap(entry['title']);
            }
            if (array_key_exists('journal', entry)) {
                journal = this._unwrap(entry['journal']);
            }
            if (array_key_exists('year', entry)) {
                year = this._unwrap(entry['year']);
            }
            if (array_key_exists('author', entry)) {
                if (this._options['extractAuthors']) {
                    tmparray = []; //In this array the authors are saved and the joind with an and
                    for (j in entry['author'] ) {
                    	var authorentry = entry['author'][j];
                        tmparray[tmparray.length] = this._formatAuthor(authorentry);
                    }
                    authors = join(', ', tmparray);
                } else {
                    authors = entry['author'];
                }
            }

            if ((''!=title) || (''!=journal) || (''!=year) || (''!=authors)) {
                line = str_replace("TITLE", title, line);
                line = str_replace("JOURNAL", journal, line);
                line = str_replace("YEAR", year, line);
                line = str_replace("AUTHORS", authors, line);
                line += "\n";
                ret  += line;
            } else {
                this._generateWarning('WARNING_LINE_WAS_NOT_CONVERTED', '', print_r(entry,1));
            }
        }
        ret += "</p>\n";
        return ret;
    }
};


var bibtexify = (function($) {
    // helper function to "compile" LaTeX special characters to HTML
    var htmlify = function(str) {
        // TODO: this is probably not a complete list..
        str = str.replace(/\\"\{a\}/g, '&auml;')
            .replace(/\{\\aa\}/g, '&aring;')
            .replace(/\\aa\{\}/g, '&aring;')
            .replace(/\\"a/g, '&auml;')
            .replace(/\\"\{o\}/g, '&ouml;')
            .replace(/\\'e/g, '&eacute;')
            .replace(/\\'\{e\}/g, '&eacute;')
            .replace(/\\'a/g, '&aacute;')
            .replace(/\\'A/g, '&Aacute;')
            .replace(/\\"o/g, '&ouml;')
            .replace(/\\ss\{\}/g, '&szlig;')
            .replace(/\{/g, '')
            .replace(/\}/g, '')
            .replace(/\\&/g, '&')
            .replace(/--/g, '&ndash;');
        return str;
    };
    var uriencode = function(str) {
        // TODO: this is probably not a complete list..
        str = str.replace(/\\"\{a\}/g, '%C3%A4')
            .replace(/\{\\aa\}/g, '%C3%A5')
            .replace(/\\aa\{\}/g, '%C3%A5')
            .replace(/\\"a/g, '%C3%A4')
            .replace(/\\"\{o\}/g, '%C3%B6')
            .replace(/\\'e/g, '%C3%A9')
            .replace(/\\'\{e\}/g, '%C3%A9')
            .replace(/\\'a/g, '%C3%A1')
            .replace(/\\'A/g, '%C3%81')
            .replace(/\\"o/g, '%C3%B6')
            .replace(/\\ss\{\}/g, '%C3%9F')
            .replace(/\{/g, '')
            .replace(/\}/g, '')
            .replace(/\\&/g, '%26')
            .replace(/--/g, '%E2%80%93');
        return str;
    };
    // helper functions to turn a single bibtex entry into HTML
    var bib2html = {
        // the main function which turns the entry into HTML
        entry2html: function(entryData, bib) {
            var type = entryData.entryType.toLowerCase();
            // default to type misc if type is unknown
            if(array_keys(bib2html).indexOf(type) === -1) {
                type = 'misc';
                entryData.entryType = type;
            }
            var itemStr = htmlify(bib2html[type](entryData));
            itemStr += "<div class='publ'><ul class='list-unstyled'>"
            itemStr += bib2html.abstex(entryData);
            itemStr += bib2html.links(entryData);
            itemStr += bib2html.bibtex(entryData);
            itemStr += bib2html.code(entryData);
            itemStr += bib2html.others(entryData);

            //itemStr +=  "<span class='pubd'>" + " "+ entryData.note + "<\/span>";
            //  }
            if (bib.options.tweet && entryData.url) {
                itemStr += bib2html.tweet(entryData, bib);
            }
            itemStr += "<\/ul><\/div>"

            //if(entryData.anote){ // image is given
            //    s = '<div class="pubwrap"><div class="row"><span class="col-md-3">'
            //    s += '<span class="pubimg"><img src="' + entryData.anote + '" style="max-width: 100%; height: auto;">' +
            //         '<\/span><\/span><span class="col-md-8">'
            //    itemStr = s + itemStr + '<\/span><\/div>'
            //}

            // if(entryData.anote){ // image is given
            //     itemStr = '<div class="mypubwrap"><div class="row"><div class="col-md-9">' +
            //         itemStr + '<\/div>' +
            //         '<div class="col-md-3"><span class="pubimg"><img src="' + entryData.anote + '" style="max-width: 100%; height: auto;">' +
            //          '<\/span><\/div><\/div><\/div>'
            // } else {
            //      itemStr = '<div class="mypubwrap"><div class="row"><div class="col-md-12">' +
            //                 itemStr + '<\/div><\/div><\/div>'
            // }
            if(entryData.anote){ // image is given
                itemStr = '<div class="mypubwrap"><div class="row"><div class="col-md-2"><img src="' +
                            entryData.anote + '" class="pubimg" style="max-width: 110px; height: auto;vertical-align: left;"><\/div>' +
                            '<div class="col-md-10">' +
                            itemStr + '<\/div>' +
                            '<\/div><\/div><\/div>'
            } else {
              itemStr = '<div class="mypubwrap"><div class="row"><div class="col-md-2"><span class="pubimg"><img src="' +
                          "./images/whiteImage.png" + '" style="max-width: 110px; height: auto;vertical-align: left;"><\/span><\/div>' +
                          '<div class="col-md-10">' +
                          itemStr + '<\/div>' +
                         '<\/div><\/div><\/div>'
            }


            return itemStr.replace(/undefined[,.]?/g,
                                   '<span class="undefined">missing<\/span>');
        },
        // converts the given author data into HTML
        authors2html: function(authorData) {
            var authorsStr = '';
            for (var index = 0; index < authorData.length; index++) {
                if (index > 0) { authorsStr += ", "; }
                authorsStr += authorData[index].last;
            }
            return htmlify(authorsStr);
        },
        // adds links to the PDF or url of the item
        links: function(entryData) {
            var itemStr = '';
            if (entryData.url && ( entryData.url.match(/.*\.pdf/)  || entryData.url.match(/\/pdf\//) || entryData.url.match(/pdf\?id=/))  ) {
            itemStr += '&nbsp;<span style="color:white;font-size:12px;background-color:#FFCECE;cursor: pointer;"> <a title="PDF of this paper" href="'+  entryData.url +'" target="_blank"><font color="black">pdf<\/font><\/a>&nbsp;<\/span>';
          //  itemStr += '<button type="button" class="btn btn-danger btn-xs disabled" style="border: none;cursor: pointer;font-size:12px;background-color: #900"> <a title="PDF of this article" href="' +
          //            entryData.url + '" target="_blank"><font color="white">.pdf (draft)<\/font><\/a><\/button>';
            } else if (entryData.url) {
              itemStr += '&nbsp;<span style="color:white;font-size:12px;background-color:#FFCECE;cursor: pointer;"> <a title="Link to this paper" href="'+  entryData.url +'" target="_blank"><font color="black">url<\/font><\/a>&nbsp;<\/span>';

            //  itemStr += '<button type="button" class="btn btn-danger btn-xs disabled" style="border: none;cursor: pointer;font-size:12px;background-color: #900"> <a title="PDF of this article" href="' +
            //            entryData.url + '" target="_blank"><font color="white">.url (draft)<\/font><\/a><\/button>';
            }

            return itemStr;
        },
        // adds links to the PDF or url of the item
        code: function(entryData) {
          var itemStr = '';
            if (entryData.crossref) {
              itemStr += '&nbsp;<span style="color:white;font-size:12px;background-color:#ffa5c9;cursor: pointer;"> <a title="Code related to this paper" href="'+  entryData.crossref +'" target="_blank"><font color="black">code<\/font><\/a>&nbsp;<\/span>';
          //  itemStr += '<button type="button" class="btn btn-danger btn-xs disabled" style="border: none;cursor: pointer;font-size:12px;background-color: #900"> <a title="PDF of this article" href="' +
          //            entryData.url + '" target="_blank"><font color="white">.pdf (draft)<\/font><\/a><\/button>';

          }
            return itemStr;
        },
        others: function(entryData) {
          var itemStr = '';
            if (entryData.key) {
              itemStr += '&nbsp;<span style="color:white;font-size:12px;background-color:#B1D796;"><font color="black">'+  entryData.key +'<\/font>&nbsp;<\/span>';
          //  itemStr += '<button type="button" class="btn btn-danger btn-xs disabled" style="border: none;cursor: pointer;font-size:12px;background-color: #900"> <a title="PDF of this article" href="' +
          //            entryData.url + '" target="_blank"><font color="white">.pdf (draft)<\/font><\/a><\/button>';

          }
            return itemStr;
        },
        // <div class="publ"><ul>
        // adds the bibtex link and the opening div with bibtex content
        bibtex: function(entryData) {
            var itemStr = '&nbsp;';
            itemStr += '<a style="color:black;font-size:12px;background-color:#FFCECE" title="This paper as BibTeX" href="#" class="biblink">' + '&nbsp;bibtex &nbsp;<\/a><div class="bibinfo hidden">';

          //  itemStr += '&nbsp;&nbsp;<button type="button" class="biblink btn btn-danger btn-xs disabled" style="border: none;cursor: pointer;font-size:12px;background-color: #900"> <a title="This article as BibTeX" href="#">' +
          //             '<font color="white">.bib<\/font><\/a><\/button><div class="bibinfo hidden">';
          //  itemStr += ' <li><a title="This article as BibTeX" href="#" class="biblink">' +
          //              '.bib</a><div class="bibinfo hidden">';
            itemStr += '<a href="#" class="bibclose" title="Close">x</a>';
            itemStr += '<br><br><b>' + entryData.title + '</b><br><br>';
            itemStr += '@' + entryData.entryType + "{" + entryData.cite + ",\n";
            itemStr2 = '';
            $.each(entryData, function(key, value) {
                if (key == 'author') {
                    itemStr2 += '  author = { ';
                    for (var index = 0; index < value.length; index++) {
                        if (index > 0) { itemStr2 += " and "; }
                        itemStr2 += value[index].last;
                    }
                    itemStr2 += ' },\n';
                } else if (key != 'bdsk-url-1' && key != 'entryType' && key != 'cite' && key != 'url' && key != 'anote' && key != 'note' && key != 'keywords') {
                    itemStr2 += '  ' + key + " = { " + value + " },\n";
                }
            });
            //itemStr += itemStr2.match(/.{1,110}/g).join(" \n ");
            itemStr += itemStr2.substring(0, itemStr2.length - 2)
            itemStr += "\n}<br><br><br></div><\/li>";
            return itemStr;
        },

        abstex: function(entryData) {
            var itemStr = '';
            itemStr += '<a style="color:black;font-size:12px;background-color:#ccccff" title="Abstract of this paper" href="#" class="abslink">' + '&nbsp;abstract &nbsp;<\/a><div class="absinfo hidden">';
            itemStr += '<a href="#" class="absclose" title="Close">x</a>';
            itemStr2 = '<br><br><b>' + entryData.title + '</b><br><br>';
            $.each(entryData, function(key, value) {
                if (key == 'note') {
                    itemStr2 += value;
                } else { itemStr2 += '';}
            });
            itemStr2 += '\n';
            //itemStr2 = itemStr2.replace(/\t/gm,' ').toString();
            //itemStr2 = itemStr2.match(/(\w+|\W)/gm,'').join("");

            //itemStr2 = itemStr2.replace(/(\r\n|\r|\n)/gm," ").toString();
            //itemStr2 = itemStr2.match(/(.*?\s){10}/gm,'').join("\n");
            //itemStr2 = itemStr2.replace(/\s+/gm," ").toString();

            //str2 = str2.join(" ");
            //itemStr += str2;//.match(/.{1,10}/g).join("\n");
            itemStr += itemStr2+"<br><br><br></div><\/li>";
            return itemStr;
        },

        // generates the twitter link for the entry
        tweet: function(entryData, bib) {
          // url, via, text
          var itemStr = ' (<a title="Tweet this article" href="http://twitter.com/share?url=';
          itemStr += entryData.url;
          itemStr += '&via=' + bib.options.tweet;
          itemStr += '&text=';
          var splitName = function(wholeName) {
            var spl = wholeName.split(' ');
            return spl[spl.length-1];
          };
          var auth = entryData.author;
          if (auth.length == 1) {
            itemStr += uriencode(splitName(auth[0].last));
          } else if (auth.length == 2) {
            itemStr += uriencode(splitName(auth[0].last) + "%26" + splitName(auth[1].last));
          } else {
            itemStr += uriencode(splitName(auth[0].last) + " et al");
          }
          itemStr += ": " + encodeURIComponent('"' + entryData.title + '"');
          itemStr += '" target="_blank">tweet</a>)';
          return itemStr;
        },
        // helper functions for formatting different types of bibtex entries
        inproceedings: function(entryData) {
            s = "<div class='mypub'><span class='puba'>" + this.authors2html(entryData.author) +
                " (<span class='puby'>" + entryData.year + "<\/span>): <\/span>" +
                "<span class='pubt'>" + entryData.title + ".<\/span> " +
                "<span class='pubv'> In " + entryData.booktitle + ((entryData.pages)?", "+entryData.pages:"");
            s = s + ((entryData.address)?entryData.address:"")
            s = s + ".<\/span>";
          //  if(entryData.note){
          //      s = s + "<span class='pubd'>" + " " + entryData.note + "<\/span>";
          //  }
            s = s + "<\/div>";
            return s;
        },
        article: function(entryData) {
            s = "<span class='mypub'><span class='puba'>" + this.authors2html(entryData.author) +
                " (<span class='puby'>" + entryData.year + "<\/span>): <\/span>" +
                "<span class='pubt'>" + entryData.title + ". <\/span>" +
                "<span class='pubv'>" + entryData.journal +
                ((entryData.volume)?" "+entryData.volume:"");
            if(entryData.number){
                if(entryData.pages){
                    s = s + "(" + entryData.number + "):" + entryData.pages;
                }else{
                    s = s + "(" + entryData.number + ")";
                }
            }else{
                if(entryData.pages){
                    s = s + ":" + entryData.pages;
                }else {
                    s = s
                }
            }
            s = s + ((entryData.address)?entryData.address:"");
            s = s + ".<\/span>";
          //  if(entryData.note){
          //      s += "<span class='pubd'>" + " "+ entryData.note + "<\/span>";
          //  }
            s = s + "<\/span>";
            return s;
        },
        misc: function(entryData) {
            s = "<span class='mypub'><span class='puba'>" + this.authors2html(entryData.author) +
                " (<span class='puby'>" + entryData.year + "<\/span>): <\/span>" +
                "<span class='pubt'>" + entryData.title + ". <\/span>" +
                "<span class='pubv'>" + ((entryData.howpublished)?entryData.howpublished:"") +
                " " + ((entryData.volume)?entryData.volume:"");
            s = s + ".<\/span>";
          //  if(entryData.note){
          //      s += "<span class='pubd'>" + " " + entryData.note + "<\/span>";
          //  }
            s = s + "<\/span>";
            return s;
        },

        unpublished: function(entryData) {
            s = "<span class='mypub'><span class='puba'>" + this.authors2html(entryData.author) +
                " (<span class='puby'>" + entryData.year + "<\/span>): <\/span>" +
                "<span class='pubt'>" + entryData.title + ". <\/span>" +
                "<span class='pubv'>" + ((entryData.howpublished)?entryData.howpublished:"") +
                " " + ((entryData.volume)?entryData.volume:"");
            s = s + ".<\/span>";
          //  if(entryData.note){
          //      s += "<span class='pubd'>" + " " + entryData.note + "<\/span>";
          //  }
            s = s + "<\/span>";
            return s;
        },
        mastersthesis: function(entryData) {
            s = "<span class='mypub'><span class='puba'>" + this.authors2html(entryData.author) +
                " (<span class='puby'>" + entryData.year + "<\/span>): <\/span>" +
                "<span class='pubt'>" + entryData.title + ". <\/span>" +
                "<span class='pubv'>" + entryData.type +
                ((entryData.organization)?", " + entryData.organization:"") +
                ((entryData.school)?", " + entryData.school:"");
            s = s + ".<\/span>";
          //  if(entryData.note){
          //      s = s + "<span class='pubd'>" + " "+ entryData.note + "<\/span>";
          //  }
            s = s + "<\/span";
            return s;
        },
        techreport: function(entryData) {
            s = "<span class='mypub'><span class='puba'>" + this.authors2html(entryData.author) +
                " (<span class='puby'>" + entryData.year + "<\/span>): <\/span>" +
                "<span class='pubt'>" + entryData.title + ". <\/span>" +
                "<span class='pubv'>" + entryData.type +
                ((entryData.institution)?", " + entryData.institution:"") + entryData.number;
            s = s + ".<\/span>";
          //  if(entryData.note){
          //      s = s + "<span class='pubd'>" + " "+ entryData.note + "<\/span>";
          //  }
            s = s + "<\/span>";
            return s;
        },
        book: function(entryData) {
            s = "<span class='mypub'><span class='puba'>" + this.authors2html(entryData.author) +
                " (<span class='puby'>" + entryData.year + "<\/span>): <\/span>" +
                "<span class='pubt'>" + entryData.title + ". <\/span>" +
                "<span class='pubv'>" +
                ((entryData.series)?entryData.series+", ":"") +
                entryData.publisher +
                ((entryData.issn)?", ISBN: " + entryData.issn:"");
            s = s + ".<\/span>";
          //  if(entryData.note){
          //      s = s + "<span class='pubd'>" + " "+ entryData.note + "<\/span>";
          //  }
            s = s + "<\/span>";
            return s;
        },
        inbook: function(entryData) {
            s = "<span class='mypub'><span class='puba'>" + this.authors2html(entryData.author) +
                " (<span class='puby'>" + entryData.year + "<\/span>): <\/span>" +
                "<span class='pubt'>" + entryData.title + ". <\/span>" +
                "<span class='pubv'>" + entryData.booktitle + ", " +
                ((entryData.editor)?entryData.editor + " (eds.), ":"") +
                entryData.publisher +
                ((entryData.series)?", " + entryData.series:"");
            if(entryData.volume){
                if(entryData.pages){
                    s = s + entryData.volume + ":" + entryData.pages;
                }else{
                    s = s + " " + entryData.volume;
                }
            }else{
                if(entryData.pages){
                    s = s + " " + entryData.pages;
                }else {
                    s = s;
                }
            }
            s = s + ((entryData.issn)?", ISBN: " + entryData.issn:"");
            s = s + ".<\/span>";
          //  if(entryData.note){
          //      s = s + "<span class='pubd'>" + " "+ entryData.note + "<\/span>";
          //  }
            s = s + "<\/span>";
            return s;
        },

        incollection: function(entryData) {
            s = "<span class='mypub'><span class='puba'>" + this.authors2html(entryData.author) +
                " (<span class='puby'>" + entryData.year + "<\/span>): <\/span> " +
                "<span class='pubt'>" + entryData.title + ". <\/span>" +
                "<span class='pubv'>In " + entryData.booktitle +
                ((entryData.editor)?", " + entryData.editor + " (eds.), ":"") +
                ((entryData.editor)?entryData.publisher:"") +
                ((entryData.series)?", " + entryData.series:"");
            if(entryData.volume){
                if(entryData.pages){
                    s = s + ", " + entryData.volume + ":" + entryData.pages;
                }else{
                    s = s + ", " + entryData.volume;
                }
            }else{
                if(entryData.pages){
                    s = s + ", " + entryData.pages;
                }else {
                    s = s;
                }
            }
            s = s + ((entryData.issn)?", ISBN: " + entryData.issn:"");
            s = s + ".<\/span>";
          //  if(entryData.note){
          //      s = s + "<span class='pubd'>" + " "+ entryData.note + "<\/span>";
          //  }
            s = s + "<\/span>";
            return s;
        },
        // weights of the different types of entries; used when sorting
        importance: {
            'misc': 40,
            'manual': 40,
            'techreport': 40,
            'mastersthesis': 40,
            'inproceedings': 80,
            'incollection': 70,
            'proceedings': 40,
            'conference': 20,
            'article': 100,
            'phdthesis': 40,
            'inbook': 40,
            'book': 110,
            'unpublished':60
        },
        // labels used for the different types of entries
        labels: {
            'article': 'Journal',
            'book': 'Book',
            'conference': 'Conference',
            'inbook': 'Chapter',
            'incollection': 'Collection',
            'inproceedings': 'Conference',
            'manual': 'Manual',
            'mastersthesis': 'Thesis',
            'misc': 'Misc',
            'phdthesis': 'PhD',
            'proceedings': 'Edited Volume',
            'techreport': 'Techreport',
            'unpublished': 'Essay'}
    };
    // format a phd thesis similarly to masters thesis
    bib2html.phdthesis = bib2html.mastersthesis;
    // conference is the same as inproceedings
    bib2html.conference = bib2html.inproceedings;

    // event handlers for the bibtex links
    var EventHandlers = {
        showbib: function showbib(event) {
            $(this).next(".bibinfo").removeClass('hidden').addClass("open");
            $("#shutter").show();
            event.preventDefault();
        },
        hidebib: function hidebib(event) {
            $("#shutter").hide();
            $(".bibinfo.open").removeClass("open").addClass("hidden");
            event.preventDefault();
        },
        showabs: function showabs(event) {
            $(this).next(".absinfo").removeClass('hidden').addClass("open");
            $("#shutter").show();
            event.preventDefault();
        },
        hideabs: function hideabs(event) {
            $("#shutter").hide();
            $(".absinfo.open").removeClass("open").addClass("hidden");
            event.preventDefault();
        }

    };

    var Bib2HTML = function(data, $pubTable, options) {
        this.options = options;
        this.$pubTable = $pubTable;
        this.stats = { };
        this.initialize(data);
    };
    var bibproto = Bib2HTML.prototype;
    bibproto.initialize = function initialize(data) {
        var bibtex = new BibTex();
        bibtex.content = data;
        bibtex.parse();
        var bibentries = [], len = bibtex.data.length;
        var entryTypes = {};
        jQuery.extend(true, bib2html, this.options.bib2html);
        for (var index = 0; index < len; index++) {
            var item = bibtex.data[index];
            if (!item.year) {
              item.year = this.options.defaultYear || "To Appear";
            }

            var html = bib2html.entry2html(item, this);
            //bibentries.push([item.year,  html, bib2html.labels[item.entryType

            bibentries.push([item.year,  html, bib2html.labels[item.entryType]+
              ((item.keywords)?", " + item.keywords:"")]);

            //bibentries.push([item.year,  html,item.keywords]);
            entryTypes[bib2html.labels[item.entryType]] = item.entryType;


            this.updateStats(item);
        }
        jQuery.fn.dataTableExt.oSort['type-sort-asc'] = function(x, y) {
          var xx = x.split(",")[0]
          var yy = y.split(",")[0]

            var item1 = bib2html.importance[entryTypes[x]],
                item2 = bib2html.importance[entryTypes[y]];
            return ((item1 < item2) ? -1 : ((item1 > item2) ?  1 : 0));
        };
        jQuery.fn.dataTableExt.oSort['type-sort-desc'] = function(x, y) {
          var xx = x.split(",")[0]
          var yy = y.split(",")[0]

            var item1 = bib2html.importance[entryTypes[xx]],
                item2 = bib2html.importance[entryTypes[yy]];

            return ((item1 < item2) ? 1 : ((item1 > item2) ?  -1 : 0));
        };
       var table = this.$pubTable.dataTable($.extend({
                              'responsive' : true,
                              'autoWidth': false,
                              'aaData': bibentries,
                              //'aaSorting': this.options.sorting,
                              'order':  [[0,'desc'], [2,'desc']],
                              'columnDefs':  [
                                            { "sTitle": "Year","targets": [0] },
                                            { "sTitle": "Publication", "bSortable": false, "targets": [1] },
                                            { "sTitle": "Tags", "sType": "type-sort", "targets": [2] },

                                            { responsivePriority: 1, targets: 1 },
                                            { responsivePriority: 2, targets: 2 },
                                            { responsivePriority: 3, targets: 0 },

                            //                ],
                            //  "columnDefs": [
                                              { "visible": false, "targets": 0 },
                                          //    { "visible": false, "targets": 2 },


                                             { "width": "80%",  "targets": [1]},
                                              { "width": "20%",  "targets": [2]},




                                              {

                                                "targets":[2],
                                                "fnCreatedCell": function(nTd, sData, oData, iRow, iCol)
                                                {
                                                  //$(nTd).addClass('mytag');.css('max-width','100px')
                                                  $(nTd).css('max-width','120px').css('font-weight','normal').css('font-size', 'smaller').css('vertical-align','top');
                                                  var sDataSplit = sData.split(",");

                                                  s = '';
                                                  switch(sDataSplit[0]){
                                                  case 'Journal':
                                                  //  $(nTd).css('background-color', '#900');
                                                    s = s + '<span style="color:white;font-size:11px;background-color: coral">'+  sDataSplit[0] +'&nbsp;</span>';
                                                  //  s = s + '<button type="button" class="btn btn-danger btn-xs disabled" style="border: none;font-size:11px;background-color: coral">' +  sDataSplit[0] +'</button>';
                                                    break;
                                                  case 'Conference':
                                                  //  $(nTd).css('background-color', '#090'); // You can use hex code as well
                                                    s = s + '<span style="color:white;font-size:11px;background-color: #090">'+  sDataSplit[0] +'&nbsp;</span>';
                                                  //  s = s + '<button type="button" class="btn btn-success btn-xs disabled" style="border: none;font-size:11px;background-color: #090">' +  sDataSplit[0] +'</button>';

                                                    break;
                                                  case 'Collection':
                                                  //  $(nTd).css('background-color', '#1a8cff'); // You can use hex code as well
                                                    s = s + '<span style="color:white;font-size:11px;background-color: #1a8cff">'+  sDataSplit[0] +'&nbsp;</span>';
                                                    //s = s + '<button type="button" class="btn btn-info btn-xs disabled" style="border: none;font-size:11px;background-color:1a8cff">' +  sDataSplit[0] +'</button>';

                                                    break;

                                                    case 'Newspaper':
                                                    //  $(nTd).css('background-color', '#1a8cff'); // You can use hex code as well
                                                      s = s + '<span style="color:white;font-size:11px;background-color:#ffa5c9;">'+  sDataSplit[0] +'&nbsp;</span>';
                                                      //s = s + '<button type="button" class="btn btn-info btn-xs disabled" style="border: none;font-size:11px;background-color:1a8cff">' +  sDataSplit[0] +'</button>';

                                                      break;
                                                  case 'Book':
                                                  //  $(nTd).css('background-color', '#e68a00'); // You can use hex code as well
                                                    s = s + '<span style="color:white;font-size:11px;background-color: #e68a00">'+  sDataSplit[0] +'&nbsp;</span>';
                                                  //  s = s + '<button type="button" class="btn btn-warning btn-xs disabled" style="border: none;font-size:11px;background-color:#e68a00">' +  sDataSplit[0] +'</button>';

                                                    break;
                                                  default:
                                                    s = s + '<span style="color:white;font-size:11px;background-color: #696969">'+  sDataSplit[0] +'&nbsp;</span>';
                                                    //s = s + '<button type="button" class="btn btn-xs disabled" style="border: none;font-size:11px;background-color:#696969;color:white;">' +  sDataSplit[0] +'</button>';


                                                  }
                                                  //s = s + '<br>'
                                                  sDataSplit.shift();
                                                  sDataSplit.sort();

                                                  var len = sDataSplit.length;
                                                  for (var index = 0; index < len-1; index++) {
                                                    s = s + '<span style="color:black;font-size:11px;background-color: #E8E8E8">'+  sDataSplit[index] +',</span>&nbsp;';
                                                    //s = s + '<button type="button" class="btn btn-default btn-xs disabled" style="border: none;font-size:11px;font-weight:normal;background-color:#E8E8E8;color:black;margin:2px;border:none;margin-left:2px;">' +  sDataSplit[index] +'</button>';
                                                    //s = s +  sDataSplit[0] +'</button>');
                                                  }
                                                  //s = s+'</TD>'
                                                  s = s + '<span style="color:black;font-size:11px;background-color: #E8E8E8">'+  sDataSplit[index] +'</span>';

                                                  $(nTd).html(s);
                                                 }
                                               }
                                            ],
                               'bPaginate': true,
                               "pageLength": 25,
                               "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                               "drawCallback": function ( settings ) {
                                 var api = this.api();
                                 var rows = api.rows( {page:'current'} ).nodes();
                                 var last=null;

                                 api.column(0, {page:'current'} ).data().each( function ( group, i ) {
                                   if ( last !== group ) {
                                     $(rows).eq( i ).before(
                                       '<tr class="group" style="background-color:rgba(0,0,0,0.4);font-weight:bold;"><td colspan="2">'+group+'</td></tr>'
                                     );
                                     $(".biblink", this.$pubTable).on('click', EventHandlers.showbib);
                                     $(".bibclose", this.$pubTable).on('click', EventHandlers.hidebib);
                                     $(".abslink", this.$pubTable).on('click', EventHandlers.showabs);
                                     $(".absclose", this.$pubTable).on('click', EventHandlers.hideabs);

                                     last = group;
                                   }
                                 } );
                               }

                            }, this.options.datatable));
        if (this.options.visualization) {
            this.addBarChart();
        }

        $("th", this.$pubTable).unbind("click").click(function(e) {
          var $this = $(this),
              $thElems = $this.parent().find("th"),
              index = $thElems.index($this);


          if ($this.hasClass("sorting_disabled")) { return; }
          $this.toggleClass("sorting_asc").toggleClass("sorting_desc");

          if (index === 0) {
            table.fnSort( [[0, $thElems.eq(0).hasClass("sorting_asc")?"asc":"desc"],
                        [2, $thElems.eq(2).hasClass("sorting_asc")?"asc":"desc"]]);
          }
          if (index==1){
            table.fnSort( [[2, $thElems.eq(2).hasClass("sorting_asc")?"asc":"desc"],
                          [0, $thElems.eq(0).hasClass("sorting_asc")?"asc":"desc"]]);
          }

        }
      );
        // attach the event handlers to the bib items
        $(".biblink", this.$pubTable).on('click', EventHandlers.showabs);
        $(".bibclose", this.$pubTable).on('click', EventHandlers.hideabs);
        $(".abslink", this.$pubTable).on('click', EventHandlers.showabs);
        $(".absclose", this.$pubTable).on('click', EventHandlers.hideabs);

    };
    // updates the stats, called whenever a new bibtex entry is parsed
    bibproto.updateStats = function updateStats(item) {
        if (!this.stats[item.year]) {
            this.stats[item.year] = { 'count': 1, 'types': {} };
            this.stats[item.year].types[item.entryType] = 1;
        } else {
            this.stats[item.year].count += 1;
            if (this.stats[item.year].types[item.entryType]) {
                this.stats[item.year].types[item.entryType] += 1;
            } else {
                this.stats[item.year].types[item.entryType] = 1;
            }
        }
    };
    // adds the barchart of year and publication types
    bibproto.addBarChart = function addBarChart() {
        var yearstats = [], max = 0;
        $.each(this.stats, function(key, value) {
            max = Math.max(max, value.count);
            yearstats.push({'year': key, 'count': value.count,
                'item': value, 'types': value.types});
        });
        yearstats.sort(function(a, b) {
            var diff = a.year - b.year;
            if (!isNaN(diff)) {
              return diff;
            } else if (a.year < b.year) {
              return -1;
            } else if (a.year > b.year) {
              return 1;
            }
            return 0;
        });
        var chartIdSelector = "#" + this.$pubTable[0].id + "pubchart";
        var pubHeight = $(chartIdSelector).height()/max;
        var styleStr = chartIdSelector +" .year { width: " +
                        (100.0/yearstats.length) + "%; }" +
                        chartIdSelector + " .pub { height: " + pubHeight + "px; }";
        var legendTypes = [];
        var stats2html = function(item) {
            var types = [],
                str = '<div class="year">',
                sum = 0;
            $.each(item.types, function(type, value) {
              types.push(type);
              sum += value;
            });
            types.sort(function(x, y) {
              return bib2html.importance[y] - bib2html.importance[x];
            });
            str += '<div class="filler" style="height:' + ((pubHeight)*(max-sum)) + 'px;"></div>';
            for (var i = 0; i < types.length; i++) {
                var type = types[i];
                if (legendTypes.indexOf(type) === -1) {
                    legendTypes.push(type);
                }
                for (var j = 0; j < item.types[type]; j++) {
                    str += '<div class="pub ' + type + '"></div>';
                }
            }
            return str + '<div class="yearlabel">' + item.year + '</div></div>';
        };
        var statsHtml = "<style>" + styleStr + "</style>";
        yearstats.forEach(function(item) {
            statsHtml += stats2html(item);
        });
        var legendHtml = '<div class="legend">';
        for (var i = 0, l = legendTypes.length; i < l; i++) {
            var legend = legendTypes[i];
            legendHtml += '<span class="pub ' + legend + '"></span>' + bib2html.labels[legend];
        }
        legendHtml += '</div>';
        $(chartIdSelector).html(statsHtml).after(legendHtml);
    };

    // Creates a new publication list to the HTML element with ID
    // bibElemId. The bibsrc can be
    //   - a jQuery selector, in which case html of the element is used
    //     as the bibtex data
    //   - a URL, which is loaded and used as data. Note, that same-origin
    //     policy restricts where you can load the data.
    // Supported options:
    //   - visualization: A boolean to control addition of the visualization.
    //                    Defaults to true.
    //   - tweet: Twitter username to add Tweet links to bib items with a url field.
    //   - sorting: Control the default sorting of the list. Defaults to [[0, "desc"],
    //              [1, "desc"]]. See http://datatables.net/api fnSort for details
    //              on formatting.
    //   - bib2html: Can be used to override any of the functions or properties of
    //               the bib2html object. See above, starting around line 40.
    return function(bibsrc, bibElemId, opts) {
        var options = $.extend({}, {'visualization': false,
                                  },
                                opts);
        var $pubTable = $("#" + bibElemId).addClass("bibtable");

        if ($("#shutter").length === 0) {
            $pubTable.before('<div id="shutter" class="hidden"></div>');
            $("#shutter").click(EventHandlers.hidebib);
        }
        if (options.visualization) {
            $pubTable.before('<div id="' + bibElemId + 'pubchart" class="bibchart"></div>');
        }
        var $bibSrc;
        if(bibsrc.indexOf('/') === -1) {
            $bibSrc = $(bibsrc);
        }
        if ($bibSrc && $bibSrc.length) { // we found an element, use its HTML as bibtex
            new Bib2HTML($bibSrc.html(), $pubTable, options);
            $bibSrc.hide();
        } else { // otherwise we assume it is a URL
            var callbackHandler = function(data) {
                new Bib2HTML(data, $pubTable, options);
            };
            $.get(bibsrc, callbackHandler, "text");
        }
    };
})(jQuery);
