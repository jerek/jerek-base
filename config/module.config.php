<?php
return [
    'controllers' => [
        'invokables' => [
            'JerekBase\Controller\Skeleton' => 'JerekBase\Controller\SkeletonController',
        ],
    ],
    'router' => [
        'routes' => [
            'skeleton' => [
                'type'    => 'segment',
                'options' => [
                    'route'    => '/skeleton[/:action][/:id]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => 'JerekBase\Controller\Skeleton',
                        'action'     => 'index',
                    ],
                ],
            ],
        ],
    ],
    'view_manager' => [
        'template_path_stack' => [
            'jerek-base' => __DIR__ . '/../view',
        ],
    ],
];
