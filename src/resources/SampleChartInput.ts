import {Repo} from '../types/ChartTypes'; 

// TODO: this are just quick examples, find nicer pictures.
const folderIcon = "https://cdn1.iconfinder.com/data/icons/modern-universal/32/icon-32-512.png";
const fileIcon = "https://image.flaticon.com/icons/png/512/55/55025.png";


export const repo: Repo = {
    "name":"my-app",
    "heat":55,
    "info":[
       {
          "name":"Contributors",
          "value":"ABC"
       },
       {
          "name":"Quality score",
          "value":78
       }
    ],
    "image": folderIcon,
    "children":[
       {
          "name":"frontend",
          "heat":22,
          "image": folderIcon,
          "info":[
             {
                "name":"Contributors",
                "value":"DCE"
             },
             {
                "name":"Quality score",
                "value":44
             }
          ],
          "children":[
             {
                "name":"src",
                "heat":50,
                "info":[
                    {
                       "name":"Contributors",
                       "value":" ABC"
                    },
                    {
                       "name":"Quality score",
                       "value":78
                    }
                 ],
                "image": folderIcon,
                "children":[
                   {
                      "name":"app.ts",
                      "size":2,
                      "heat":30,
                      "image": fileIcon,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"components",
                      "size":3,
                      "heat":98,
                      "image": fileIcon,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"styles",
                      "size":1,
                      "heat":33,
                      "image": fileIcon,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"tests",
                      "size":1,
                      "heat":75,
                      "image": fileIcon,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"serviceWorker.ts",
                      "size":1,
                      "heat":34,
                      "image": fileIcon,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"index.ts",
                      "size":1,
                      "heat":67,
                      "image": fileIcon,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"logo.svg",
                      "size":1,
                      "heat":3,
                      "image": fileIcon,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   }
                ]
             }
          ]
       },
       {
          "name":"A2",
          "size":1,
          "heat":35,
          "image": fileIcon,
          "info":[
            {
               "name":"Contributors",
               "value":" ABC"
            },
            {
               "name":"Quality score",
               "value":78
            }
         ]
       }
    ]
 }; 