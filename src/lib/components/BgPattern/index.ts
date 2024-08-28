import fourPointStars from './4-point-stars.svg';
import anchorsAway from './anchors-away.svg';
import bamboo from './bamboo.svg';
import bankNote from './bank-note.svg';
import bathroomFloor from './bathroom-floor.svg';
import brickWall from './brick-wall.svg';
import bubbles from './bubbles.svg';
import charlieBrown from './charlie-brown.svg';
import circuitBoard from './circuit-board.svg';
import cutout from './cutout.svg';
import diagonalLines from './diagonal-lines.svg';
import endlessClouds from './endless-clouds.svg';
import fallingTriangles from './falling-triangles.svg';
import formalInvitation from './formal-invitation.svg';
import glamorous from './glamorous.svg';
import graphPaper from './graph-paper.svg';
import hexagons from './hexagons.svg';
import hideout from './hideout.svg';
import houndstooth from './houndstooth.svg';
import iLikeFood from './i-like-food.svg';
import jigsaw from './jigsaw.svg';
import leaf from './leaf.svg';
import lineInMotion from './line-in-motion.svg';
import moroccan from './moroccan.svg';
import morphingDiamonds from './morphing-diamonds.svg';
import overlappingCircles from './overlapping-circles.svg';
import parkayFloor from './parkay-floor.svg';
import pieFactory from './pie-factory.svg';
import plus from './plus.svg';
import polkaDots from './polka-dots.svg';
import rain from './rain.svg';
import randomShapes from './random-shapes.svg';
import signal from './signal.svg';
import temple from './temple.svg';
import texture from './texture.svg';
import ticTacToe from './tic-tac-toe.svg';
import topography from './topography.svg';
import wiggle from './wiggle.svg';
import xEquals from './x-equals.svg';

export const patterns = {
	fourPointStars,
	anchorsAway,
	bamboo,
	bankNote,
	bathroomFloor,
	brickWall,
	bubbles,
	charlieBrown,
	circuitBoard,
	cutout,
	diagonalLines,
	endlessClouds,
	fallingTriangles,
	formalInvitation,
	glamorous,
	graphPaper,
	hexagons,
	hideout,
	houndstooth,
	iLikeFood,
	jigsaw,
	leaf,
	lineInMotion,
	moroccan,
	morphingDiamonds,
	overlappingCircles,
	parkayFloor,
	pieFactory,
	plus,
	polkaDots,
	rain,
	randomShapes,
	signal,
	temple,
	texture,
	ticTacToe,
	topography,
	wiggle,
	xEquals
};

export type PatternName = keyof typeof patterns;
export const patternNames = Object.keys(patterns);
