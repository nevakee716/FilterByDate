| **Name** | **Filter By External Association** | **Version** | 1.3 |
| --- | --- | --- | --- |
| **Updated by** | Mathias PFAUWADEL |

## Description 
Allow you to filter items on a node depending on an association

## Installation
https://github.com/casewise/cpm/wiki

## Parameter setup 

### DisplayName : 
Set the layout javascript class name you want to use to display this node

### Filter In : 
Set the id(s) of the node(s) which should be display if the association exists

### Filter Out: 
Set the id(s) of the node(s) which should be display if the association doesn't exists

### Display if all selected association of an association type : 
Element need to have all selected association of an association type to be displayed

### Display if at least one association in all association type : 
Element need to have at least one association in all association type to be displayed

### Use Layout : Set the layout javascript class name you want to use to display this node

### Others Option : 
If Use Layout is a custom layout, you can pass custom option by here following this schema =>
Option1:ValueOption1:TypeOption1#Option2:ValueOption2:TypeOption2......

* if your option is a checkbox, choose TypeOption = 1 and ValueOption = true if it's checked and false if unchecked
* if your option is a text field, choose TypeOption = 0 and ValueOption = your text option

## How to set association filter
### Exemple 1
Here with have the following metamodel
Process level 2 associated with Process level 3
Process level 3 associated with Sites
Process level 3 associated with Application


We want to display the following list :
- Process level 2
  - Process level 3

And be able to display only the Process level 3 that have the association with a chosen Sites or Applications (you can put as much association type you want)

Here is a list with the associations

<img src="https://raw.githubusercontent.com/nevakee716/FilterByExternalAssociation/master/screen/1.png" alt="Drawing" style="width: 95%;"/>

The layout configure like this : 
<img src="https://raw.githubusercontent.com/nevakee716/FilterByExternalAssociation/master/screen/2.png" alt="Drawing" style="width: 95%;"/>

and here is the result if we select Paris
<img src="https://raw.githubusercontent.com/nevakee716/FilterByExternalAssociation/master/screen/3.png" alt="Drawing" style="width: 95%;"/>
<img src="https://raw.githubusercontent.com/nevakee716/FilterByExternalAssociation/master/screen/4.png" alt="Drawing" style="width: 95%;"/>

Here we see all the Process level 2 which are in Paris

We can select 1 or more association.(See option to see the behaviour of the list)
<img src="https://raw.githubusercontent.com/nevakee716/FilterByExternalAssociation/master/screen/5.png" alt="Drawing" style="width: 95%;"/>
<img src="https://raw.githubusercontent.com/nevakee716/FilterByExternalAssociation/master/screen/6.png" alt="Drawing" style="width: 95%;"/>

Here we see all the Process level 2 which are in Paris or(can be modify with option) in Lyon






